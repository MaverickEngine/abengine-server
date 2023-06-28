const dotenv = require("dotenv");
dotenv.config();

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

const server = `http://localhost:${process.env.NODE_LOCAL_PORT}`;
let token = null;

chai.use(chaiHttp);

function randomString(minValue, maxValue, dataSet = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    if (!minValue) {
        minValue = 20;
        maxValue = 20;
    }

    if (!maxValue) {
        maxValue = minValue;
    }
    const length = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    let randomString = "";

    for (let i = 0; i < length; i++)
        randomString += dataSet.charAt(Math.floor(Math.random() * dataSet.length));
    return randomString;
}

const random_campaign_name = randomString(10, 20);
let experiments = [];

for(let i = 0; i < 5; i++) {
    experiments.push({
        name: `Experiment ${randomString(10, 20)}`,
        value: `<div>Experiment ${i}</div>`,
    });
}

let campaign_id = null;

describe('Setup', () => {
    before(async function() {
        const login_data = await chai.request(server)
        .post("/login")
        .send({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
        token = login_data.body.token;
    })

	describe("create_campaign", () => {
		it("it should create a campaign", (done) => {
			chai.request(server)
				.post("/call/campaign/create_campaign")
                .set('Authorization', `Bearer ${token}`)
				.send({ name: `Campaign ${random_campaign_name}`, experiments, running: true })
				.end((err, res) => {
                    // console.log(res.body);
					res.should.have.status(200);
					res.body.success.should.equal(true);
                    res.body.campaign.should.have.property('_id');
                    res.body.campaign.should.have.property('name');
                    res.body.experiments.should.be.a('array');
                    res.body.experiments[0].campaign_id.should.equal(res.body.campaign._id);
                    campaign_id = res.body.campaign._id;
                    experiments = res.body.experiments;
					done();
				});
		});
    });

    describe("serve_experiment", () => {
        for (let x = 0; x < 10; x++) {
            it("it should serve an experiment", (done) => {
                chai.request(server)
                    .get(`/call/campaign/${campaign_id}/serve_experiment`)
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        console.log(res.body);
                        res.should.have.status(200);
                        res.body.success.should.equal(true);
                        res.body.experiment.should.have.property('_id');
                        res.body.experiment.should.have.property('name');
                        res.body.experiment.should.have.property('value');
                        done();
                });
            });
        }
    });

    let win_count = 0;
    describe("win_experiment", () => {
        for (let x = 0; x < 5; x++) {
            it("it should win an experiment", (done) => {
                chai.request(server)
                    .get(`/call/experiment/${experiments[0]._id}/win`)
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        console.log(res.body);
                        res.should.have.status(200);
                        res.body.success.should.equal(true);
                        done();
                });
            });
        }
    });
    

    describe("serve_experiment", () => {
        for (let x = 0; x < 10; x++) {
            it("it should serve an experiment", (done) => {
                chai.request(server)
                    .get(`/call/campaign/${campaign_id}/serve_experiment`)
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        console.log(res.body);
                        if (res.body.experiment._id === experiments[0]._id) {
                            win_count++;
                        }
                        res.should.have.status(200);
                        res.body.success.should.equal(true);
                        res.body.experiment.should.have.property('_id');
                        res.body.experiment.should.have.property('name');
                        res.body.experiment.should.have.property('value');
                        done();
                });
            });
        }

        it("it should have served the winning experiment 50% or more of the time", (done) => {
            console.log(win_count);
            win_count.should.be.greaterThanOrEqual(5);
            done();
        });
    });

});
