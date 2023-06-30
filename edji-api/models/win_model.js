/* global JXPSchema ObjectId Mixed */

const WinSchema = new JXPSchema({
    experiment_id: { type: ObjectId, link: "Experiment", required: true, index: true },
    hit_id: { type: ObjectId, link: "Hit", index: true },
    ip_addr: { type: String, index: true },
    user_agent: { type: String, index: true },
    referrer: { type: String, index: true },
    timestamp: { type: Date, index: true, default: Date.now},
    time_lapsed: { type: Number, index: true },
    utm_campaign: { type: String, index: true },
    utm_content: { type: String, index: true },
    utm_medium: { type: String, index: true },
    utm_source: { type: String, index: true },
    utm_term: { type: String, index: true },
    data: { type: Mixed },
},
{
    perms: {
        admin: "cr",
        owner: "cr",
        user: "c",
    }
});

WinSchema.post('save', async function() {
    const Experiment = require("./experiment_model");
    const experiment = await Experiment.findOne({ _id: this.experiment_id });
    experiment.wins++;
    experiment.hits++;
    experiment.save();
});

const Win = JXPSchema.model('Win', WinSchema);
module.exports = Win;