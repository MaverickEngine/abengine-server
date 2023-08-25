# ABEngine Server

A smart server that advises you which version of an A/B test to show to a user.

Traditional AB testing has a period of Exploration, followed by a period of Exploitation. ABEngine doesn't use traditional AB testing, but instead uses a machine learning algorithm to immediately exploit the best version of an A/B test at any given time. Additional options can be added at any time, and the server will automatically start advising users to see the new option.

ABEngine is built on top of [EDJI](https://github.com/10layer/edji).

## How it works

A traditional AB test tries to determine which version of an experiment is best by showing different versions to different users, and then measuring the results. This is a slow process, and it can take a long time to determine which version is best.

ABEngine uses a machine learning algorithm to immediately determine which version is best. It does this by using a Bayesian Bandit algorithm. The algorithm is based on the idea of a multi-armed bandit. Imagine a slot machine with multiple arms. Each arm has a different payout. The goal is to determine which arm has the best payout. The machine learning algorithm will try each arm, and then start to favor the arm that has the best payout. The more times the arm is played, the more confident the algorithm is that it has the best payout. The algorithm will continue to try other arms, but it will favor the arm that has the best payout.

First, a *Campaign* is created. For example, a campaign might be a newsletter signup form.

Under that campaign, *Experiments* are created. An experiment is a version of what we're testing that we can present to the user. For our newsletter signup form, one version has the words "Sign Up Now!" and the other version has the words "Please Sign Up."

Should a specific experiment be presented to a user, a *Hit* is recorded. 

(Once a user sees a specific experiment, they will continue to see that experiment and no further hits will be recorded.)

If the *Hit* results in the user taking the action we want them to take, a *Win* is recorded. 

There are separate *Admin* and *End User* APIs, as users do not need to authenticate to record hits and wins.

## Admin API

The Admin API is used to create and manage campaigns, experiments, hits, and wins. It requires authentication to use. 

## Client API

A client API is used to record hits and wins. It does not require authentication to use. 

### Endpoints

- "/serve/:campaign_id" - Returns the experiment to show to the user. If the user has already seen the experiment, the same experiment will be returned. If the user has not seen the experiment, a the best experiment to show at any point will be returned. A hit is automatically recorded for the user.

- "/win/:experiment_id" - Records a win for the experiment. This should be called when the user takes the action we want them to take.

- "/autowin/:campaign_id" - Records a win for the experiment that was returned by the "/serve/:campaign_id" endpoint. This should be called when the user takes the action we want them to take, and we don't specifically have knowledge of which experiment won. It will return the winning experiment, which is useful if you need to show it again, eg. a headline. 