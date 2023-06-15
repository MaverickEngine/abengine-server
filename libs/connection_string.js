require("dotenv").config();

// mongodb connection
const {
	MONGODB_USER,
	MONGODB_PASSWORD,
	MONGODB_HOST,
	MONGODB_PORT,
	MONGODB_DATABASE,
	MONGODB_AUTH_DB,
} = process.env;

// mongodb connection
let connection_string = `mongodb://localhost:27017/jxp`;
if (MONGODB_HOST) {
	connection_string = `mongodb://${ (MONGODB_USER && MONGODB_PASSWORD) ? `${MONGODB_USER}:${MONGODB_PASSWORD}@` : '' }${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}?${ (MONGODB_AUTH_DB) ? `authSource=${MONGODB_AUTH_DB}` : '' }`
}

module.exports = connection_string;