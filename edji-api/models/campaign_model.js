/* global JXPSchema ObjectId */
// const MultiArmedBandit = require("../libs/abengine/libs/multi_armed_bandit");
// const Experiment = require("./experiment_model");

const CampaignSchema = new JXPSchema({
    name: { type: String, unique: true, index: true, required: true, trim: true, lowercase: true },
    running: { type: Boolean, default: false },
    start_date: { type: Date, index: true, default: Date.now},
    end_date: { type: Date, index: true },
    user_id: { type: ObjectId, link: "User" },
},
{
    perms: {
        admin: "crud",
        owner: "crud",
        user: "c",
        all: ""
    }
});

CampaignSchema.statics.create_campaign = async function (data) {
    const Experiment = require("./experiment_model");
    try {
        if (!data.name) {
            throw new Error("No name provided");
        }
        const campaign = new Campaign(data);
        await campaign.save();
        const id = campaign._id;
        let experiments = [];
        if (data.experiments) {
            for (let i = 0; i < data.experiments.length; i++) {
                data.experiments[i].campaign_id = id;
                data.experiments[i].running = campaign.running;
                if (!data.experiments[i].start_date) {
                    data.experiments[i].start_date = campaign.start_date;
                }
                if (!data.experiments[i].end_date) {
                    data.experiments[i].end_date = campaign.end_date;
                }
                const experiment = new Experiment(data.experiments[i]);
                await experiment.save();
                experiments.push(experiment);
            }
        }
        return {
            success: true,
            campaign,
            experiments
        };
    } catch (err) {
        return {
            success: false,
            error: err.toString()
        };
    }
}

// CampaignSchema.statics.serve_experiment = async function (campaign) {
//     try {
//         if (!campaign) {
//             throw new Error("No campaign found");
//         }
//         const experiments = await Experiment.find({ campaign_id: campaign._id, running: true });
//         if (!experiments || experiments.length === 0) {
//             throw new Error("No experiments found");
//         }
//         const bandit = new MultiArmedBandit(experiments);
//         const sample_experiment = bandit.sample();
//         // console.log(sample_experiment);
//         const experiment = await Experiment.findOne(sample_experiment._id);
//         if (!experiment) {
//             throw new Error("No experiment found");
//         }
//         experiment.hits++;
//         await experiment.save();
//         return {
//             success: true,
//             experiment
//         };
//     } catch (err) {
//         console.error(err);
//         return {
//             success: false,
//             error: err.toString()
//         };
//     }
// }

const Campaign = JXPSchema.model('Campaign', CampaignSchema);
module.exports = Campaign;