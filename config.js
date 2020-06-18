const env = process.env.NODE_ENV || 'dev';

const dev = {
	app: {
		env,
		port: 3000,
	},
	auth: {
		secret: 'randomsecretpassword',
		expiresIn: 3600,
	},
	mongodb: {
		host: 'localhost',
		port: 27017,
		db: 'tp_db',
	},
};

const test = {
	app: {
		env,
		port: 3001,
	},
	auth: {
		secret: 'randomsecretpassword',
		expiresIn: 60,
	},
	mongodb: {
		env,
		host: 'localhost',
		port: 27017,
		db: 'tp_db_test',
	},
};

const prod = {
	app: {
		port: 3000,
	},
	auth: {
		secret: process.env.AUTH_SECRET,
		expiresIn: 60,
	},
	mongodb: {
		host: process.env.DB_HOST,
		port: parseInt(process.env.DB_PORT, 10),
		db: process.env.DB_NAME,
	},
};
const config = {
	dev,
	test,
	prod,
};
module.exports = config[env];
