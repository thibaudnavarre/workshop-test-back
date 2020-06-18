const { GameGrid } = require('./game-grid');

describe('game grid', () => {
	let grid;

	beforeEach(() => {
		grid = new GameGrid();
	});

	describe('cell checking', () => {
		it('should have cells 0;0 available by default', () => {
			const ca = grid.isCellAvailable(0, 0);
			expect(ca).toBeTruthy();
		});

		it('should throw an error when the row to check does not exist', () => {
			expect(() => {
				grid.isCellAvailable(10, 0);
			}).toThrow();
		});

		it('should throw an error when the col to check does not exist', () => {
			expect(() => {
				grid.isCellAvailable(0, 10);
			}).toThrow();
		});

		describe('cell availability', () => {
			it('should have cells 0;0 not available when it is filled', () => {
				grid.fillCell(0, 0);
				const ca = grid.isCellAvailable(0, 0);
				expect(ca).toBeFalsy();
			});

			it('should throw an error when the row to fill does not exist', () => {
				expect(() => {
					grid.fillCell(10, 0);
				}).toThrow();
			});

			it('should throw an error when the col to fill does not exist', () => {
				expect(() => {
					grid.fillCell(0, 10);
				}).toThrow();
			});
		});
	});

	describe('call releasing', () => {
		it('should release a cell', () => {
			grid.fillCell(0, 0);
			grid.releaseCell(0, 0);
			const ca = grid.isCellAvailable(0, 0);
			expect(ca).toBeTruthy();
		});

		it('should throw an error when trying to release an available cell', () => {
			expect(() => {
				grid.releaseCell(0, 0);
			}).toThrow();
		});
	});

	describe('get random available cell', () => {
		it('should get the available cell of the random', () => {
			jest.spyOn(global.Math, 'random').mockReturnValue(0);
			const cell = grid.getRandomAvailableCell();
			expect(cell).toEqual({ row: 0, col: 0 });
		});

		it('should get the first available cell when the targeted is not available', () => {
			jest.spyOn(global.Math, 'random').mockReturnValue(0);
			grid.fillCell(0, 0);
			const cell = grid.getRandomAvailableCell();
			expect(cell).toEqual({ row: 0, col: 1 });
		});

		it('should modulate the random to an existing index the array of available cell', () => {
			jest.spyOn(global.Math, 'random').mockReturnValue(0.9);
			const cell = grid.getRandomAvailableCell();
			expect(cell).toEqual({ row: 2, col: 2 });
		});

		it('should throw an error when there is no cell available', () => {
			let col = 0;
			let row = 0;
			for (; col < GameGrid.NB_COL; col += 1) {
				for (row = 0; row < GameGrid.NB_ROW; row += 1) {
					grid.fillCell(row, col);
				}
			}
			expect(() => {
				grid.getRandomAvailableCell();
			}).toThrow();
		});
	});
});
