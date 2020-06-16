const request = require('request-promise-native');
const config = require('../../config');

const BASE_URI = 'http://localhost:' + config.app.port + '/game';

describe('default', () => {
	let reqOptions;

	beforeEach(() => {
		reqOptions = {
			json: true,
			resolveWithFullResponse: true,
		};
	});

	describe('/game/start', () => {
		beforeEach(() => {
			reqOptions.uri = BASE_URI + '/start';
			reqOptions.method = 'GET';
		});

		afterEach(async () => {
			await request({
				json: true,
				uri: BASE_URI + '/stop',
				method: 'GET',
			});
		});

		it('start return a 200 when the game start successfuly', async () => {
			let res = await request(reqOptions);
			expect(res.statusCode).toEqual(200);
		});

		it('start return a 401 when the game is already running', async () => {
			await request(reqOptions);
			await expect(request(reqOptions)).rejects.toMatchObject({
				statusCode: 401,
			});
		});
	});

	describe('/game/stop', () => {
		beforeEach(() => {
			reqOptions.uri = BASE_URI + '/stop';
			reqOptions.method = 'GET';
		});

		it('start return a 200 when requesting to stop the game', async () => {
			let res = await request(reqOptions);
			expect(res.statusCode).toEqual(200);
		});
	});
});
