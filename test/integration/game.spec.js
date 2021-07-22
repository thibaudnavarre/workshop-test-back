const request = require('request-promise-native');
const { Validator } = require('jsonschema');
const config = require('../../config');
const getStatusSchema = require('./schemas/game/status.get.res.json');
const getWhackAtSchema = require('./schemas/game/whack-at.post.req.json');

const BASE_URI = `http://localhost:${config.app.port}/game`;

describe('default', () => {
	let reqOptions;
	const validator = new Validator();

	beforeEach(() => {
		reqOptions = {
			json: true,
			resolveWithFullResponse: true,
		};
	});

	describe('/game/start', () => {
		beforeEach(() => {
			reqOptions.uri = `${BASE_URI}/start`;
			reqOptions.method = 'POST';
		});

		afterEach(async () => {
			await request({
				json: true,
				uri: `${BASE_URI}/stop`,
				method: 'POST',
			});
		});

		it('should return a 200 when the game start successfuly', async () => {
			const res = await request(reqOptions);
			expect(res.statusCode).toEqual(200);
		});

		it('should return a 401 when the game is already running', async () => {
			await request(reqOptions);
			await expect(request(reqOptions)).rejects.toMatchObject({
				statusCode: 401,
			});
		});
	});

	describe('/game/stop', () => {
		beforeEach(() => {
			reqOptions.uri = `${BASE_URI}/stop`;
			reqOptions.method = 'POST';
		});

		it('should return a 200 when requesting to stop the game', async () => {
			const res = await request(reqOptions);
			expect(res.statusCode).toEqual(200);
		});
	});

	describe('/game/status', () => {
		beforeEach(() => {
			reqOptions.uri = `${BASE_URI}/status`;
			reqOptions.method = 'GET';
		});

		it('should return a 200 and an object when requesting a game status', async () => {
			const res = await request(reqOptions);
			expect(res.statusCode).toEqual(200);
			expect(res.Body).toBeTruthy();
			expect(validator.validate(res.body, getStatusSchema).errors).toHaveLength(0);
		});
	});

	describe('/game/whack-at', () => {
		beforeEach(() => {
			reqOptions.uri = `${BASE_URI}/whack-at`;
			reqOptions.method = 'POST';
		});

		it('should return a 401 when the game is not running', async () => {
			const simpleMolePosition = { row: 0, col: 0 };
			reqOptions.body = simpleMolePosition;
			expect(validator.validate(simpleMolePosition, getWhackAtSchema).errors).toHaveLength(0);
			await expect(request(reqOptions)).rejects.toMatchObject({
				statusCode: 401,
			});
		});

		describe('game started', () => {
			beforeEach(async () => {
				await request({
					json: true,
					uri: `${BASE_URI}/start`,
					method: 'GET',
				});
			});

			afterEach(async () => {
				await request({
					json: true,
					uri: `${BASE_URI}/stop`,
					method: 'GET',
				});
			});

			it('should return a 200 when the position is valid and in a good format and whenever a mole is whacked or not', async () => {
				const simpleMolePosition = { row: 0, col: 0 };
				reqOptions.body = simpleMolePosition;
				expect(validator.validate(simpleMolePosition, getWhackAtSchema).errors).toHaveLength(0);
				const res = await request(reqOptions);
				expect(res.statusCode).toEqual(200);
			});

			it('should return a 401 when the position is not valid but in a good format', async () => {
				const simpleMolePosition = { row: 0, col: 12 };
				reqOptions.body = simpleMolePosition;
				expect(validator.validate(simpleMolePosition, getWhackAtSchema).errors).toHaveLength(0);
				await expect(request(reqOptions)).rejects.toMatchObject({
					statusCode: 401,
				});
			});

			it('should return a 401 when the position is not in the good format', async () => {
				const simpleMolePosition = {};
				reqOptions.body = simpleMolePosition;
				await expect(request(reqOptions)).rejects.toMatchObject({
					statusCode: 401,
				});
			});
		});
	});
});
