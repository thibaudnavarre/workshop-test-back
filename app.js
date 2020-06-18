const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./app/routes');
const config = require('./config');

const app = express();

// Set up default mongoose connection
const mongoDB = `mongodb://${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.db}`;
mongoose
	.connect(mongoDB, { useNewUrlParser: true })
	.then(() => {
		// eslint-disable-next-line no-console
		console.log('Connection to database has been established successfully.');
	})
	.catch((err) => {
		// eslint-disable-next-line no-console
		console.log('Unable to connect to the database:', err);
	});

app.use(cors({ origin: true, credentials: true }));

app.use(
	bodyParser.urlencoded({
		extended: true,
	}),
);
app.use(bodyParser.json());
app.use(function (req, res, next) {
	// eslint-disable-next-line no-console
	console.log(`received : ${req.method} ${req.originalUrl}`);
	next();
});
app.use('/', routes);

app.listen(config.app.port, function () {
	// eslint-disable-next-line no-console
	console.log(`[ENV=${config.app.env}] Application running on port ${config.app.port}`);
});
