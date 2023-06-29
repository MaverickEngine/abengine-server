/*
=================
     EDJI Server
=================

Documentation:
https://jxp.readthedocs.io/en/latest/

*/

const mongoose = require("mongoose");
const EDJI = require("../libs/jxp");
require("dotenv").config();
const pkg = require("../package.json");

// If you want to use the config file, uncomment this line:
// const config = require("config");
// and comment out the following line:
const config = {};

config.callbacks = {
	// Examples:
	// post: function(modelname, item, user) {
	// 	console.log("Post callback");
	// },
	// put: function(modelname, item, user) {
	// 	console.log("Put callback");
	// },
	// delete: function(modelname, item, user, opts) {
	// 	console.log("Delete callback");
	// }

	post: function() {},
	put: function() {},
	delete: function() {}
};

config.pre_hooks = {
	login: (req, res, next) => {
		next();
	},
	get: (req, res, next) => {
		next();
	},
	getOne: (req, res, next) => {
		next();
	},
	post: (req, res, next) => {
		next();
	},
	put: (req, res, next) => {
		next();
	},
	delete: (req, res, next) => {
		next();
	},
};

// ES6 promises
mongoose.Promise = Promise;
if (!config.mongo) config.mongo = {};
if (!config.mongo.options) config.mongo.options = {};
const mongo_options = Object.assign(config.mongo.options, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const connection_string = require("../libs/connection_string");
console.log(`Connecting to ${connection_string}`);
mongoose.connect(connection_string, mongo_options);

const db = mongoose.connection;

// mongodb error
db.on('error', console.error.bind(console, 'connection error:'));

// mongodb connection open
db.once('open', () => {
	console.log(`Connected to Mongo at: ${new Date()}`);
});

var server = new EDJI(config);

let port = process.env.NODE_DOCKER_PORT || process.env.PORT || config.port || 4001;
if (process.env.NODE_ENV === "test") port = 4005;
server.listen(port, function() {
	console.log('%s listening at %s', `${pkg.name} v${pkg.version}`, server.url);
});

module.exports = server; // For testing
