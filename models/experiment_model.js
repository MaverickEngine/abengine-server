/* global JXPSchema ObjectId Mixed */

const ExperimentSchema = new JXPSchema({
    campaign_id: { type: ObjectId, link: "Campaign", required: true, index: true },
    name: { type: String, required: true, trim: true, lowercase: true },
    value: { type: Mixed },
    hits: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    running: { type: Boolean, default: true },
    start_date: { type: Date, index: true, default: Date.now},
    end_date: { type: Date, index: true },
    user_id: { type: ObjectId, link: "User" },
},
{
    perms: {
        admin: "crud",
        owner: "crud",
        user: "c",
    }
});

ExperimentSchema.pre('save', function(next) {
    if (this.isNew) {
        this.hits = 0;
        this.wins = 0;
    }
    next();
});

ExperimentSchema.statics.win = async function (experiment) {
    try {
        experiment.wins++;
        experiment.hits++;
        await experiment.save();
        return {
            success: true,
            experiment
        };
    } catch (err) {
        return {
            success: false,
            error: err.toString()
        };
    }
}

const Experiment = JXPSchema.model('Experiment', ExperimentSchema);
module.exports = Experiment;