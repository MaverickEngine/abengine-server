/* global JXPSchema ObjectId Mixed */

const HitSchema = new JXPSchema({
    experiment_id: { type: ObjectId, link: "Experiment", required: true, index: true },
    ip_addr: { type: String, index: true },
    user_agent: { type: String, index: true },
    referrer: { type: String, index: true },
    timestamp: { type: Date, index: true, default: Date.now},
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

HitSchema.post('save', async function() {
    const Experiment = require("./experiment_model");
    const experiment = await Experiment.findOne({ _id: this.experiment_id });
    experiment.hits++;
    experiment.save();
});

const Hit = JXPSchema.model('Hit', HitSchema);
module.exports = Hit;