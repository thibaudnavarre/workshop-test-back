const env = process.env.NODE_ENV.trim() || 'dev';

const dev = {
	app: {
		env,
		port: 3000,
	},
	auth: {
		secret: process.env.AUTH_SECRET || 'randomsecretpassword',
		expiresIn: 3600,
	},
	mongodb: {
		host: process.env.DB_HOST || 'localhost',
		port: parseInt(process.env.DB_PORT, 10) || 27017,
		db: process.env.DB_NAME || 'db_tp_tdd',
	},
};

const test = {
	app: {
		env,
		port: 3001,
	},
	auth: {
		secret: process.env.AUTH_SECRET || 'randomsecretpassword',
		expiresIn: 3600,
	},
	mongodb: {
		host: process.env.DB_HOST || 'localhost',
		port: parseInt(process.env.DB_PORT, 10) || 27018,
		db: process.env.DB_NAME || 'db_tp_tdd',
	},
};

const prod = {
	app: {
		env,
		port: 3000,
	},
	auth: {
		secret: process.env.AUTH_SECRET,
		expiresIn: 3600,
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
