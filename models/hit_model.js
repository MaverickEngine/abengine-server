/* global JXPSchema ObjectId Mixed */

const HitSchema = new JXPSchema({
    experiment_id: { type: ObjectId, link: "Experiment", required: true, index: true },
    ip_addr: { type: String, index: true },
    user_agent: { type: String, index: true },
    referrer: { type: String, index: true },
    timestamp: { type: Date, index: true, default: Date.now},
    data: { type: Mixed },
},
{
    perms: {
        admin: "cr",
        owner: "cr",
        user: "c",
    }
});

HitSchema.post('save', function(next) {
    const Experiment = require("./experiment_model");
    Experiment.findOne({ _id: this.experiment_id }, function(err, experiment) {
        if (err) { return next(err); }
        experiment.hits++;
        experiment.save();
    });
    next();
});

const Hit = JXPSchema.model('Hit', HitSchema);
module.exports = Hit;