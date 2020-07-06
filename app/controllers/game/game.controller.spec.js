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
		// TODO : Activité 2
	});
});
