class MultiArmedBandit {
    constructor(experiments) {
        this.experiments = experiments;
        this.total_hits = 0;
        this.total_wins = 0;
        this.experiments.forEach((experiment) => {
            this.total_hits += experiment.hits;
            this.total_wins += experiment.wins;
        });
    }

    add_experiment(experiment) {
        this.experiments.push(experiment);
        this.total_hits += experiment.hits;
        this.total_wins += experiment.wins;
    }

    rbeta(a, b) {
        let sum = a + b, 
            ratio = a / b, 
            min = Math.min(a, b), 
            lhs, 
            rhs,
            y
        let lambda = min <= 1 ? min : Math.sqrt((2 * a * b - a - b) / (sum - 2));
        do {
            let r1 = Math.random()
            let r2 = Math.random()
            y = Math.pow(1 / r1 - 1, 1 / lambda)
            lhs = 4 * r1 * r2 * r2
            rhs = Math.pow(y, a - lambda) * Math.pow((1 + ratio) / (1 + ratio * y), sum)
        } while(lhs >= rhs)
        return ratio * y / (1 + ratio * y);
    }

    sample() {
        let max = 0;
        let winner = null;
        this.experiments.forEach((experiment) => {
            const score = this.rbeta(experiment.wins + 1, experiment.hits - experiment.wins + 1);
            console.log(score);
            if (score > max) {
                max = score;
                winner = experiment;
            }
        });
        return winner;
    }

    distribution() {
        const distribution = [];
        this.experiments.forEach((experiment) => {
            const alpha = experiment.wins + 1;
            const beta = experiment.hits - experiment.wins + 1;
            const score = this.rbeta(alpha, beta);
            distribution.push({
                experiment,
                score
            });
        });
        return distribution;
    }
}

module.exports = MultiArmedBandit;