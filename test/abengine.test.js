const dotenv = require("dotenv");
dotenv.config();

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

const api_server = `http://localhost:${process.env.API_PORT}`;
const abengine_server = `http://localhost:${process.env.ABENGINE_PORT}`;
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

describe('Tests', () => {
    before(async function() {
        const login_data = await chai.request(api_server)
        .post("/login")
        .send({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
        token = login_data.body.token;
    })

	describe("create_campaign", () => {
		it("it should create a campaign", (done) => {
			chai.request(api_server)
				.post("/call/campaign/create_campaign")
                .set('Authorization', `Bearer ${token}`)
				.send({ name: `Campaign ${random_campaign_name}`, experiments, running: true })
				.end((err, res) => {
                    console.log(res.body);
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

    // describe("serve_experiment_1", () => {
    //     const iterations = 10;
    //     for (let x = 0; x < iterations; x++) {
    //         it("it should serve an experiment", (done) => {
    //             chai.request(abengine_server)
    //                 .get(`/serve/${campaign_id}`)
    //                 .end((err, res) => {
    //                     console.log(res.body);
    //                     res.should.have.status(200);
    //                     res.body.experiment.should.have.property('_id');
    //                     res.body.experiment.should.have.property('name');
    //                     res.body.experiment.should.have.property('value');
    //                     // Check cookies
    //                     res.should.have.cookie(`abengine_campaign_${campaign_id}`);
    //                     done();
    //             });
    //         });
    //     }
    // });

    // let win_count = 0;
    // describe("win_experiment", () => {
    //     const iterations = 100;
    //     for (let x = 0; x < iterations; x++) {
    //         it("it should win an experiment", (done) => {
    //             chai.request(abengine_server)
    //                 .get(`/win/${experiments[0]._id}`)
    //                 .end((err, res) => {
    //                     console.log(res.body);
    //                     res.should.have.status(200);
    //                     res.body.success.should.equal(true);
    //                     done();
    //             });
    //         });
    //     }
    // });
    

    // describe("serve_experiment_2", () => {
    //     const iterations = 100;
    //     for (let x = 0; x < iterations; x++) {
    //         it("it should serve an experiment", (done) => {
    //             chai.request(abengine_server)
    //                 .get(`/serve/${campaign_id}`)
    //                 .end((err, res) => {
    //                     console.log(res.body);
    //                     if (res.body.experiment._id === experiments[0]._id) {
    //                         win_count++;
    //                     }
    //                     res.should.have.status(200);
    //                     res.body.experiment.should.have.property('_id');
    //                     res.body.experiment.should.have.property('name');
    //                     res.body.experiment.should.have.property('value');
    //                     done();
    //             });
    //         });
    //     }

    //     it("it should have served the winning experiment 50% or more of the time", (done) => {
    //         console.log(win_count);
    //         win_count.should.be.greaterThanOrEqual(iterations / 2);
    //         done();
    //     });
    // });

    // describe("test_404s", () => {
    //     it("serve should return a 404 error", (done) => {
    //         chai.request(abengine_server)
    //             .get(`/serve/649e7f4bf4cae41b1a0cb3f8`)
    //             .end((err, res) => {
    //                 console.log(res.body);
    //                 res.should.have.status(404);
    //                 done();
    //         });
    //     });

    //     it("win should return a 404 error", (done) => {
    //         chai.request(abengine_server)
    //             .get(`/win/649e7f4bf4cae41b1a0cb3f8`)
    //             .end((err, res) => {
    //                 console.log(res.body);
    //                 res.should.have.status(404);
    //                 done();
    //         });
    //     });
    // });

    describe("test_cookies", () => {
        let cookies;
        let experiment_id;
        it("should set a cookie", (done) => {
            chai.request(abengine_server)
                .get(`/serve/${campaign_id}`)
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(200);
                    res.should.have.cookie(`abengine_campaign_${campaign_id}`);
                    cookies = res.headers['set-cookie'];
                    experiment_id = res.body.experiment._id;
                    done();
            });
        });
        for (let x = 0; x < 10; x++) {
            it("should serve the same experiment based on the cookie", (done) => {
                chai.request(abengine_server)
                    .get(`/serve/${campaign_id}`)
                    .set('Cookie', cookies)
                    .end((err, res) => {
                        console.log(res.body);
                        res.should.have.status(200);
                        res.body.experiment._id.should.equal(experiment_id);
                        done();
                });
            });
        }
        it("should autowin the experiment based on the cookie", (done) => {
            chai.request(abengine_server)
                .get(`/autowin/${campaign_id}`)
                .set('Cookie', cookies)
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(200);
                    res.body.autowin.should.equal(true);
                    res.body.experiment_id.should.equal(experiment_id);
                    done();
            });
        });
    });


});
