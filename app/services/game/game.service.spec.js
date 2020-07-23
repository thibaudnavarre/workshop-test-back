const GameOrchestratorService = require('../game-orchestrator/game-orchestrator.service');
const GameService = require('./game.service');
const { AvailabilityError } = require('../game-orchestrator/game-grid/game-errors');
const NoGameRunningError = require('./NoGameRunningError');
const ScoringCalculatorSercice = require('../scoring-calculator/scoring-calculator');

jest.mock('../game-orchestrator/game-orchestrator.service');
jest.mock('../scoring-calculator/scoring-calculator');

describe('GameService', () => {
	let mockGameGridInstance;

	beforeEach(() => {
		GameService.currentGameGridInstance = null;
		GameOrchestratorService.gameStart.mockReturnValue(mockGameGridInstance);
	});

	describe('start', () => {
		it('should ask the orchestrator to start a new game', () => {
			GameService.gameStart();
			expect(GameOrchestratorService.gameStart).toHaveBeenCalled();
		});

		it('should reset the score', () => {
			GameService.gameStart();
			expect(ScoringCalculatorSercice.reset).toHaveBeenCalled();
		});
	});

	describe('stop', () => {
		it('should ask the orchestrator to stop the running new game', () => {
			GameService.gameStop();
			expect(GameOrchestratorService.gameStop).toHaveBeenCalled();
		});
	});

	describe('isGameRunning', () => {
		it('should return false when the orchestrater responds the game is not running', () => {
			GameOrchestratorService.isGameRunning.mockReturnValue(false);
			expect(GameService.isGameRunning()).toBeFalsy();
		});

		it('should return true when the orchestrater responds the game is running', () => {
			GameOrchestratorService.isGameRunning.mockReturnValue(true);
			expect(GameService.isGameRunning()).toBeTruthy();
		});
	});

	describe('getMoles', () => {
		beforeAll(() => {
			mockGameGridInstance = {
				getMoles: jest.fn(),
			};
		});
		it('should return the empty array when there is no game instance', () => {
			expect(GameService.getMoles()).toEqual([]);
		});

		it('should return the empty array of moles returned by the grid', () => {
			mockGameGridInstance.getMoles.mockReturnValue([]);
			GameService.gameStart();
			expect(GameService.getMoles()).toEqual([]);
		});

		it('should return the array of moles returned by the grid', () => {
			const returnedMoles = [{}];
			mockGameGridInstance.getMoles.mockReturnValue(returnedMoles);
			GameService.gameStart();
			expect(GameService.getMoles()).toEqual(returnedMoles);
		});
	});

	describe('whackAt', () => {
		beforeAll(() => {
			mockGameGridInstance = {
				deleteMole: jest.fn(),
			};
		});

		beforeEach(() => {
			GameOrchestratorService.isGameRunning.mockReturnValue(true);
		});

		afterEach(() => {
			mockGameGridInstance.deleteMole.mockClear();
		});

		it('should throw an error if there is no game instance', async () => {
			await expect(() => {
				GameService.whackAt(0, 0);
			}).toThrow(NoGameRunningError);
		});

		it('should ask the grid to whack at the given position', () => {
			GameService.gameStart();
			GameService.whackAt(0, 0);
			expect(mockGameGridInstance.deleteMole).toHaveBeenCalledWith(0, 0);
		});

		it('should throw an error if the curring game is stoped', async () => {
			GameOrchestratorService.isGameRunning.mockReturnValue(false);
			GameService.gameStart();
			await expect(() => {
				GameService.whackAt(0, 0);
			}).toThrow(NoGameRunningError);
		});

		it('should dispatch that are not availability error', async () => {
			mockGameGridInstance.deleteMole.mockImplementation(() => {
				throw new Error();
			});
			GameService.gameStart();
			await expect(() => {
				GameService.whackAt(0, 0);
			}).toThrow(Error);
		});

		it('should not dispatch the error when the mole delelte return an availability error', async () => {
			mockGameGridInstance.deleteMole.mockImplementation(() => {
				throw new AvailabilityError();
			});
			GameService.gameStart();
			await expect(() => {
				GameService.whackAt(0, 0);
			}).not.toThrow(AvailabilityError);
		});

		it('should ask the scoring service to add point when a mole is whacked', () => {
			GameService.gameStart();
			GameService.whackAt(0, 0);
			expect(ScoringCalculatorSercice.addWhackedPoint).toHaveBeenCalled();
		});
	});

	describe('getScore', () => {
		it('should return the score of 0 calculated by the scoring service', () => {
			ScoringCalculatorSercice.getScore.mockReturnValue(0);
			expect(GameService.getScore()).toEqual(0);
		});

		it('should return the score of 1 calculated by the scoring service', () => {
			ScoringCalculatorSercice.getScore.mockReturnValue(1);
			expect(GameService.getScore()).toEqual(1);
		});
	});
});
