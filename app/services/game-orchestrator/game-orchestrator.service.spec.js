// eslint-disable-next-line no-unused-vars
const GameGrid = require('./game-grid/game-grid');

const mockGameGridInstance = {
	getRandomAvailableCell: () => {
		return { row: 0, col: 0 };
	},
	getMoles: jest.fn(),
	generateNewMole: jest.fn(),
	deleteMole: jest.fn(),
};
jest.mock('./game-grid/game-grid', () => {
	return {
		GameGrid: jest.fn().mockImplementation(() => {
			return mockGameGridInstance;
		}),
	};
});

const GameOrchestratorService = require('./game-orchestrator.service');

const { TICK_DURATION } = GameOrchestratorService;

describe('game-orchestrator.service', () => {
	beforeEach(() => {
		jest.useFakeTimers();
		mockGameGridInstance.getMoles.mockReturnValue([]);
	});

	afterEach(() => {
		jest.clearAllTimers();
		GameOrchestratorService.gameStop();
	});

	describe('running status', () => {
		it('should have the isRunning game status to false by default', () => {
			const running = GameOrchestratorService.isGameRunning();
			expect(running).toEqual(false);
		});

		it('should have the isRunning game status to true when the game start', () => {
			GameOrchestratorService.gameStart();
			const running = GameOrchestratorService.isGameRunning();
			expect(running).toEqual(true);
		});

		it('should have the isRunning game status to false when the game has been stoped', () => {
			GameOrchestratorService.gameStart();
			GameOrchestratorService.gameStop();
			const running = GameOrchestratorService.isGameRunning();
			expect(running).toEqual(false);
		});

		it('should automaticaly stop the game after the maximum number of ticks', () => {
			GameOrchestratorService.gameStart();
			jest.advanceTimersByTime(TICK_DURATION * GameOrchestratorService.NB_GAME_TICK);
			const running = GameOrchestratorService.isGameRunning();
			expect(running).toEqual(false);
		});
		it('should throw an error when trying to start a running game', () => {
			GameOrchestratorService.gameStart();
			expect(() => {
				GameOrchestratorService.gameStart();
			}).toThrow();
		});
	});

	describe('getting moles', () => {
		it('should return moles of the game grid', () => {
			mockGameGridInstance.getMoles.mockReturnValue([]);
			expect(GameOrchestratorService.getMoles()).toEqual([]);
		});
	});

	describe('mole generation', () => {
		beforeEach(() => {
			mockGameGridInstance.generateNewMole.mockClear();
			mockGameGridInstance.deleteMole.mockClear();
		});

		it('should create a mole 1 tick after the game start', () => {
			GameOrchestratorService.gameStart();
			jest.advanceTimersByTime(TICK_DURATION);
			expect(mockGameGridInstance.generateNewMole).toHaveBeenCalledTimes(1);
		});

		it('should have create 2 mole 2 ticks after the game started', () => {
			GameOrchestratorService.gameStart();
			jest.advanceTimersByTime(TICK_DURATION * 2);
			expect(mockGameGridInstance.generateNewMole).toHaveBeenCalledTimes(2);
		});

		describe('stop generation', () => {
			it('should stop the mole generation after stoping the game (just after the game start)', () => {
				GameOrchestratorService.gameStart();
				GameOrchestratorService.gameStop();
				jest.advanceTimersByTime(TICK_DURATION);
				expect(mockGameGridInstance.generateNewMole).not.toHaveBeenCalled();
			});

			it('should stop the mole generation after stoping the game (2 tick after the game start) ', () => {
				GameOrchestratorService.gameStart();
				jest.advanceTimersByTime(TICK_DURATION);
				GameOrchestratorService.gameStop();
				jest.advanceTimersByTime(TICK_DURATION);
				expect(mockGameGridInstance.generateNewMole).toHaveBeenCalledTimes(1);
			});
		});

		describe('mole deletion', () => {
			const moleWithFirstTick = { position: { row: 0, col: 0 }, tickGeneration: 0 };

			it('should remove the mole with more than 2 ticks every tick', () => {
				mockGameGridInstance.getMoles.mockReturnValue([moleWithFirstTick]);
				GameOrchestratorService.gameStart();
				jest.advanceTimersByTime(TICK_DURATION * 3);
				expect(mockGameGridInstance.deleteMole).toHaveBeenCalledWith(
					moleWithFirstTick.position.row,
					moleWithFirstTick.position.col,
				);
			});

			it('should remove the mole when it is whacked', () => {
				mockGameGridInstance.getMoles.mockReturnValue([moleWithFirstTick]);
				GameOrchestratorService.gameStart();
				GameOrchestratorService.whackAt(moleWithFirstTick.position.row, moleWithFirstTick.position.col);
				expect(mockGameGridInstance.deleteMole).toHaveBeenCalledWith(
					moleWithFirstTick.position.row,
					moleWithFirstTick.position.col,
				);
			});

			it('should throw an error on whacking if is the game not running', () => {
				expect(() => {
					GameOrchestratorService.whackAt(0, 0);
				}).toThrow();
			});
		});
	});
});
