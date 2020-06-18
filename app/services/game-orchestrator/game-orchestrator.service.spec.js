// eslint-disable-next-line no-unused-vars
const GameGrid = require('./game-grid/game-grid');

const mockReleaseCell = jest.fn();
jest.mock('./game-grid/game-grid', () => {
	return {
		GameGrid: jest.fn().mockImplementation(() => {
			return {
				getRandomAvailableCell: () => {
					return { row: 0, col: 0 };
				},
				fillCell: () => {},
				releaseCell: mockReleaseCell,
			};
		}),
	};
});

const GameOrchestratorService = require('./game-orchestrator.service');

const { TICK_DURATION } = GameOrchestratorService;

describe('game-orchestrator.service', () => {
	beforeEach(() => {
		jest.useFakeTimers();
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

		it('should automaticaly stop the game after 10 secs', () => {
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

	describe('mole management', () => {
		it('should have 0 moles when the game start', () => {
			GameOrchestratorService.gameStart();
			const moles = GameOrchestratorService.getMoles();
			expect(moles).toHaveLength(0);
		});

		it('should reset moles when starting a new game', () => {
			GameOrchestratorService.gameStart();
			jest.advanceTimersByTime(TICK_DURATION);
			GameOrchestratorService.gameStop();
			GameOrchestratorService.gameStart();
			const moles = GameOrchestratorService.getMoles();
			expect(moles).toHaveLength(0);
		});

		it('should create a mole after 2 secs after the game start', () => {
			GameOrchestratorService.gameStart();
			jest.advanceTimersByTime(TICK_DURATION);
			const moles = GameOrchestratorService.getMoles();
			expect(moles).toHaveLength(1);
		});

		describe('mole generation', () => {
			it('should stop the mole generation (0 secs after starting) after stoping the game', () => {
				GameOrchestratorService.gameStart();
				GameOrchestratorService.gameStop();
				jest.advanceTimersByTime(TICK_DURATION);
				const moles = GameOrchestratorService.getMoles();
				expect(moles).toHaveLength(0);
			});

			it('should stop the mole generation (2 secs after starting) after stoping the game', () => {
				GameOrchestratorService.gameStart();
				jest.advanceTimersByTime(TICK_DURATION);
				GameOrchestratorService.gameStop();
				jest.advanceTimersByTime(TICK_DURATION);
				const moles = GameOrchestratorService.getMoles();
				expect(moles).toHaveLength(1);
			});

			it('should have create 2 mole after 4 secs after the game start', () => {
				GameOrchestratorService.gameStart();
				jest.advanceTimersByTime(TICK_DURATION * 2);
				const moles = GameOrchestratorService.getMoles();
				expect(moles).toHaveLength(2);
			});
		});

		describe('moles positioning', () => {
			beforeEach(() => {
				jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
			});
			it('should generate moles with a random position in the game grid', () => {
				GameOrchestratorService.gameStart();
				jest.advanceTimersByTime(TICK_DURATION);
				const moles = GameOrchestratorService.getMoles();
				expect(moles[0].position.row).toBeDefined();
				expect(moles[0].position.col).toBeDefined();
			});
		});

		describe('mole deletion', () => {
			it('should remove the mole and release its cell after 4 secs', () => {
				GameOrchestratorService.gameStart();
				jest.advanceTimersByTime(TICK_DURATION);
				const firstMole = GameOrchestratorService.getMoles()[0];
				jest.advanceTimersByTime(TICK_DURATION * 2);
				const moles = GameOrchestratorService.getMoles();
				expect(moles).toHaveLength(2);
				expect(moles[0]).not.toEqual(firstMole);
				expect(mockReleaseCell).toHaveBeenCalledWith(firstMole.position.row, firstMole.position.col);
			});

			it('should remove the mole when it is whacked', () => {
				GameOrchestratorService.gameStart();
				jest.advanceTimersByTime(TICK_DURATION);
				const firstMole = GameOrchestratorService.getMoles()[0];
				GameOrchestratorService.whackAt(firstMole.position.row, firstMole.position.col);
				expect(GameOrchestratorService.getMoles()).toHaveLength(0);
				expect(mockReleaseCell).toHaveBeenCalledWith(firstMole.position.row, firstMole.position.col);
			});

			it('should throw an error on whacking if is the game not running', () => {
				expect(() => {
					GameOrchestratorService.whackAt(0, 0);
				}).toThrow();
			});
		});
	});
});
