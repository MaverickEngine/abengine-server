/* global JXPSchema ObjectId Mixed */

const CampaignSchema = new JXPSchema({
    name: { type: String, index: true, trim: true },
    uid: { type: String, unique: true, index: true, required: true, trim: true, lowercase: true },
    user_id: { type: ObjectId, link: "User", index: true },
    running: { type: Boolean, default: false },
    start_date: { type: Date, index: true, default: Date.now},
    end_date: { type: Date, index: true },
    data: { type: Mixed },
},
{
    perms: {
        admin: "crud",
        owner: "crud",
        user: "c",
        all: ""
    }
});

CampaignSchema.index({ uid: 1, user_id: 1 }, { unique: true });

CampaignSchema.pre('save', async function() {
    if (this.isNew && this.__user && this.__user._id) {
        this.user_id = this.__user._id;
    }
});

CampaignSchema.statics.create_campaign = async function (data) {
    const Experiment = require("./experiment_model");
    try {
        if (!data.uid) {
            throw new Error("No uid provided");
        }
        const user_id = data.__user._id;
        if (!user_id) {
            throw new Error("No user_id provided");
        }
        const campaign_data = {
            uid: data.uid,
            user_id: user_id,
            running: data.running,
            start_date: data.start_date || Date.now(),
            end_date: data.end_date || null,
            data: data.data || {}
        }
        const campaign = new Campaign(campaign_data);
        await campaign.save();
        let experiments = [];
        if (data.experiments) {
            for (let i = 0; i < data.experiments.length; i++) {
                const experiment_data = {
                    campaign_id: campaign._id,
                    uid: data.experiments[i].uid,
                    value: data.experiments[i].value,
                    running: data.experiments[i].running,
                    start_date: data.experiments[i].start_date || campaign.start_date,
                    end_date: data.experiments[i].end_date || campaign.end_date,
                    data: data.experiments[i].data
                }
                const experiment = new Experiment(experiment_data);
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
        console.error(err);
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