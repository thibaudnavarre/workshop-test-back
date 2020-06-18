const GameController = require('./game.controller');
const GameOrchestratorService = require('../../services/game-orchestrator/game-orchestrator.service');

jest.mock('../../services/game-orchestrator/game-orchestrator.service');

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
			expect(GameOrchestratorService.gameStart).toHaveBeenCalled();
		});

		it('should send an empty response when the game start succeed', () => {
			GameController.startNewGame(req, res);
			expect(res.send).toHaveBeenCalled();
		});

		it('should return a bad request status code when the game start throw an error', () => {
			GameOrchestratorService.gameStart.mockImplementation(() => {
				throw new Error();
			});
			GameController.startNewGame(req, res);
			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.send).toHaveBeenCalled();
		});
	});
	describe('stopCurrentGame', () => {
		it('should call the service to start a new game', () => {
			GameController.stopCurrentGame(req, res);
			expect(GameOrchestratorService.gameStop).toHaveBeenCalled();
		});

		it('should send an empty response', () => {
			GameController.stopCurrentGame(req, res);
			expect(res.send).toHaveBeenCalled();
		});
	});
});
