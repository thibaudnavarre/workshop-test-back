const { GameGrid } = require('./game-grid');

describe('game grid', () => {
	let grid;

	const originalIsPositionInTable = GameGrid.isPositionInTable;

	beforeEach(() => {
		grid = new GameGrid();
	});

	describe('position is in table', () => {
		it(`should return true when the position is (0;0)`, () => {
			expect(GameGrid.isPositionInTable(0, 0)).toEqual(true);
		});

		const positionOutPositions = [
			{ row: -1, col: 0 },
			{ row: 0, col: -1 },
			{ row: GameGrid.NB_ROW, col: 0 },
			{ row: 0, col: GameGrid.NB_COL },
		];

		positionOutPositions.forEach((positionToCheck) => {
			it(`should return false when the position is out of boundaries (${positionToCheck.row}, ${positionToCheck.col})`, () => {
				expect(GameGrid.isPositionInTable(positionToCheck.row, positionToCheck.col)).toEqual(false);
			});
		});
	});

	describe('cell checking', () => {
		const stubIsPositionInTable = jest.fn();

		beforeAll(() => {
			GameGrid.isPositionInTable = stubIsPositionInTable;
		});

		beforeEach(() => {
			stubIsPositionInTable.mockReturnValue(true);
			stubIsPositionInTable.mockClear();
		});

		afterAll(() => {
			GameGrid.isPositionInTable = originalIsPositionInTable;
		});

		it('should have cells available by default (0;0)', () => {
			const ca = grid.isCellAvailable(0, 0);
			expect(ca).toBeTruthy();
		});

		it('should throw an error when the cell to check does not exist', () => {
			stubIsPositionInTable.mockReturnValue(false);
			expect(() => {
				grid.isCellAvailable(10, 0);
			}).toThrow();
		});
	});

	describe('add mole', () => {
		it('should have cells 0;0 not available when it is filled', () => {
			grid.addMole(0, 0, 1);
			expect(grid.isCellAvailable(0, 0)).toBeFalsy();
		});

		it('should have cells 0;0 with the tickGeneration 1 in the array of mole when it is filled', () => {
			grid.addMole(0, 0, 1);
			expect(grid.getMoles()[0]).toEqual({ position: { col: 0, row: 0 }, tickGeneration: 1 });
		});

		it('should throw an error if the cell is not available', () => {
			grid.isCellAvailable = () => false;
			expect(() => {
				grid.addMole(0, 0, 1);
			}).toThrow();
		});
	});

	describe('delete mole', () => {
		it('should make the cell (0;0) available', () => {
			grid.addMole(0, 0);
			grid.deleteMole(0, 0);
			expect(grid.isCellAvailable(0, 0)).toBeTruthy();
		});

		it('should release delete the mole from the array of moles', () => {
			grid.addMole(0, 0);
			grid.deleteMole(0, 0);
			expect(grid.getMoles()).not.toContain({ position: { col: 0, row: 0 }, tickGeneration: 1 });
		});

		it('should return an error if the array of moles is empty', () => {
			expect(() => {
				grid.deleteMole(1, 1);
			}).toThrow('no mole to delete');
		});

		it('should throw an error when trying to release an available cell', () => {
			grid.isCellAvailable = () => true;
			grid.addMole(1, 1);
			expect(() => {
				grid.deleteMole(0, 0);
			}).toThrowError('cell already available');
		});
	});

	describe('get random available cell', () => {
		it('should return the (0;0) cell when the random return 0 and (0;0) never used', () => {
			jest.spyOn(global.Math, 'random').mockReturnValue(0);
			const cell = grid.getRandomAvailableCell();
			expect(cell).toEqual({ row: 0, col: 0 });
		});

		it('should return the (0;1) cell when the random return 0 and (0;0) not available', () => {
			jest.spyOn(global.Math, 'random').mockReturnValue(0);
			grid.addMole(0, 0);
			const cell = grid.getRandomAvailableCell();
			expect(cell).toEqual({ row: 0, col: 1 });
		});

		it('should return the (2;2) cell when the random return 0.9 and (2;2) never used', () => {
			jest.spyOn(global.Math, 'random').mockReturnValue(0.9);
			const cell = grid.getRandomAvailableCell();
			expect(cell).toEqual({ row: 2, col: 2 });
		});

		it('should throw an error when there is no cell available', () => {
			let col = 0;
			let row = 0;
			for (; col < GameGrid.NB_COL; col += 1) {
				for (row = 0; row < GameGrid.NB_ROW; row += 1) {
					grid.addMole(row, col);
				}
			}
			expect(() => {
				grid.getRandomAvailableCell();
			}).toThrow();
		});
	});

	describe('generate new mole', () => {
		beforeEach(() => {
			grid.getRandomAvailableCell = jest.fn();
			grid.addMole = jest.fn();
		});

		it('should fill the grid cell with the random available position', () => {
			grid.getRandomAvailableCell.mockReturnValue({ row: 1, col: 1 });
			grid.generateNewMole(1);
			expect(grid.addMole).toHaveBeenCalledWith(1, 1, 1);
		});
	});

	describe('get moles', () => {
		it('should return an empty array when there is no moles', () => {
			expect(grid.getMoles()).toEqual([]);
		});

		it('should return an array of moles when there is at least one mole', () => {
			grid.generateNewMole();
			expect(grid.getMoles()).toHaveLength(1);
		});
	});
});
