const mongoose = require('mongoose');
const config = require('../../config');

const cleanUpDb = async () => {
	// clean your database here
};

beforeAll(async () => {
	if (mongoose.connection.readyState === 0) {
		const mongoDB = `mongodb://${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.db}`;
		mongoose
			.connect(mongoDB, { useNewUrlParser: true })
			.then(() => {})
			// eslint-disable-next-line no-console
			.catch((e) => console.error('DB error !', e));
	}
	await cleanUpDb();
});

afterAll(async () => {
	await cleanUpDb();
	mongoose.connection
		.close()
		.then(() => {})
		// eslint-disable-next-line no-console
		.catch((e) => console.error('DB closing error !', e));
});
