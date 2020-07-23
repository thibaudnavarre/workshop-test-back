const GameController = require('./game.controller');
const GameService = require('../../services/game/game.service');

jest.mock('../../services/game/game.service');

describe('game.controller', () => {
	let req;
	let res;

	beforeEach(() => {
		req = { body: {} };
		res = {
			json: jest.fn(),
			send: jest.fn(),
			status: jest.fn(),
		};
		res.status.mockReturnValue(res);
	});

	describe('startNewGame', () => {
		it('should call the service to start a new game', () => {
			GameController.startNewGame(req, res);
			expect(GameService.gameStart).toHaveBeenCalled();
		});

		it('should send an empty response when the game start succeed', () => {
			GameController.startNewGame(req, res);
			expect(res.send).toHaveBeenCalled();
		});

		it('should return a bad request status code when the game start throw an error', () => {
			GameService.gameStart.mockImplementation(() => {
				throw new Error();
			});
			GameController.startNewGame(req, res);
			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.send).toHaveBeenCalled();
		});
	});

	describe('stopCurrentGame', () => {
		it('should call the service to stop the current game', () => {
			GameController.stopCurrentGame(req, res);
			expect(GameService.gameStop).toHaveBeenCalled();
		});

		it('should send an empty response', () => {
			GameController.stopCurrentGame(req, res);
			expect(res.send).toHaveBeenCalled();
		});
	});

	describe('getStatus', () => {
		it('should send the array of moles and the game status to true', () => {
			GameService.isGameRunning.mockReturnValue(true);
			GameService.getMoles.mockReturnValue([{}]);
			GameController.getStatus(req, res);
			expect(res.json).toHaveBeenCalledWith({ status: true, moles: [{}] });
		});
		it('should send an empty array of moles and the game status to false', () => {
			GameService.isGameRunning.mockReturnValue(false);
			GameService.getMoles.mockReturnValue([]);
			GameController.getStatus(req, res);
			expect(res.json).toHaveBeenCalledWith({ status: false, moles: [] });
		});
	});

	describe('whackAt', () => {
		afterEach(() => {
			GameService.whackAt = jest.fn();
		});

		it('should return a 401 when the request parameters are incorrect', () => {
			GameController.whackAt(req, res);
			expect(res.status).toHaveBeenCalledWith(401);
		});

		it('should return a 401 when the service is returning an error', () => {
			req = { body: { row: -8, col: 10 } };
			GameService.whackAt.mockImplementation(() => {
				throw new Error();
			});
			GameController.whackAt(req, res);
			expect(GameService.whackAt).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(401);
		});

		it('should return a 200 json with the score when the service has been called without any error', () => {
			GameService.getScore.mockReturnValue(1);
			req = { body: { row: 2, col: 2 } };
			GameController.whackAt(req, res);
			expect(GameService.whackAt).toHaveBeenCalled();
			expect(res.json).toHaveBeenCalledWith({ score: 1 });
		});

		it('should accept the request when the position are (O;O)', () => {
			req = { body: { row: 0, col: 0 } };
			GameController.whackAt(req, res);
			expect(GameService.whackAt).toHaveBeenCalled();
			expect(res.json).toHaveBeenCalled();
		});
	});
});
