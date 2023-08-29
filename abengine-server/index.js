const MultiArmedBandit = require("./libs/multi_armed_bandit");
const UTM = require("./libs/utm");
const restify = require("restify");
const corsMiddleware = require('restify-cors-middleware2')
const errors = require('restify-errors');
var CookieParser = require('restify-cookies');
const server = restify.createServer({
    name: "ABEngine Server",
});
const axios = require("axios");
var jwt = require('jsonwebtoken');
let apikey = null;
const secret = process.env.SECRET;

server.use(restify.plugins.bodyParser()); 
const cors = corsMiddleware({
    origins: ['*'],
});
server.use(restify.plugins.bodyParser()); 
server.use(restify.plugins.queryParser()); 
server.use(cors.preflight);
server.use(cors.actual);
server.use(CookieParser.parse);

const cookie_opts = {
    maxAge: 900000,
    path: '/',
}

const EDJI = require("jxp-helper");
let edji;

server.get("/serve/:campaign_id", async (req, res) => {
    try {
        // Look up the campaign and make sure it is running
        const { campaign_id } = req.params;
        let campaign;
        try {
            campaign = (await edji.getOne("campaign", campaign_id)).data;
            if (!campaign) {
                return res.send(new errors.NotFoundError("Campaign not found"));
            }
        } catch (err) {
            return res.send(new errors.NotFoundError("Campaign not found"));
        }
        if (!campaign.running) {
            return res.send(new errors.NotFoundError("Campaign not running"));
        }
        // Check if we have a cookie for this campaign. If so, return the experiment
        const cookies = req.cookies;
        if (cookies && cookies[`abengine_campaign_${campaign_id}`]) {
            const cookie_data = jwt.verify(cookies[`abengine_campaign_${campaign_id}`], secret);
            const experiment = cookie_data.experiment;
            return res.send({experiment});
        }
        // Look up the experiments for this campaign
        const experiments = (await edji.get("experiment", { "filter[campaign_id]": campaign_id, "filter[running]": true })).data;
        if (!experiments.length) {
            return res.send(new errors.NotFoundError("No experiments found"));
        }
        // Sample an experiment
        const bandit = new MultiArmedBandit(experiments);
        const experiment = bandit.sample();
        // Log the hit
        const utm = UTM.parse_utm(req.headers['referer']);
        const hit = await edji.post("hit", { 
            experiment_id: experiment.id,
            ip_addr: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            user_agent: req.headers['user-agent'],
            referrer: req.headers['referer'],
            timestamp: new Date(),
            utm_campaign: utm.utm_campaign,
            utm_content: utm.utm_content,
            utm_medium: utm.utm_medium,
            utm_source: utm.utm_source,
            utm_term: utm.utm_term,
        });
        // Set the cookie for next time
        const cookie_data = {
            experiment,
            hit: hit.data,
            campaign_id,
            utm,
        };
        const jwt_data = jwt.sign(cookie_data, secret);
        res.setCookie(`abengine_campaign_${campaign_id}`, jwt_data, cookie_opts);
        // Return the experiment
        res.send({experiment});
        
    } catch (err) {
        console.log(err);
        return res.send(new errors.InternalServerError(err));
    }
});

server.get("/win/:experiment_id", async (req, res) => {
    try {
        const { experiment_id } = req.params;
        const experiment = (await edji.get("experiment", { "filter[_id]": experiment_id })).data[0];
        if (!experiment) {
            return res.send(new errors.NotFoundError("Experiment not found"));
        }
        await edji.post("win", {
            experiment_id,
            ip_addr: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            user_agent: req.headers['user-agent'],
            referrer: req.headers['referer'],
            timestamp: new Date(),
        });
        res.send({ success: true });
    } catch (err) {
        console.log(err);
        return res.send(new errors.InternalServerError(err));
    }
});

server.get("/autowin/:campaign_id", async (req, res) => {
    try {
        const { campaign_id } = req.params;
        let campaign;
        try {
            campaign = (await edji.getOne("campaign", campaign_id)).data;
        } catch (err) {
            return res.send({ autowin: false, error: "Campaign not found" });
        }
        if (!campaign) {
            return res.send({ autowin: false, error: "No campaign" });
        }
        const cookies = req.cookies;
        if (cookies && cookies[`abengine_campaign_${campaign_id}`]) {
            const cookie_data = jwt.verify(cookies[`abengine_campaign_${campaign_id}`], secret);
            if (!cookie_data.hit) {
                return res.send({ autowin: false, error: "No hit" });
            }
            const win = await edji.post("win", {
                experiment_id: cookie_data.experiment._id,
                hit_id: cookie_data.hit._id,
                ip_addr: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                user_agent: req.headers['user-agent'],
                referrer: req.headers['referer'],
                timestamp: new Date(),
                time_lapsed: (new Date() * 1) - (new Date(cookie_data.hit.timestamp) * 1),
                utm_campaign: cookie_data.utm.utm_campaign,
                utm_content: cookie_data.utm.utm_content,
                utm_medium: cookie_data.utm.utm_medium,
                utm_source: cookie_data.utm.utm_source,
                utm_term: cookie_data.utm.utm_term,
            });
            return res.send({ autowin: true, experiment: cookie_data.experiment, win });
        }
        return res.send({ autowin: false, error: "No cookie" });
    } catch (err) {
        // console.log(err);
        return res.send({ autowin: false, error: err.message });
    }
});


server.listen(80, async function () {
    try {
        await axios.post("http://api:4001/setup", { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
    } catch (err) {
        console.log("Already setup");
    }
    const admin_email = process.env.ADMIN_EMAIL;
    const admin_password = process.env.ADMIN_PASSWORD;
    const login = await axios.post("http://api:4001/login", { email: admin_email, password: admin_password });
    apikey = login.data.apikey;
    edji = new EDJI({ server: "http://api:4001", apikey });
    console.log('%s listening at %s', server.name, server.url);
});