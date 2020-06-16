class GameGrid {
	static NB_ROW = 4;
	static NB_COL = 4;

	constructor() {
		this.grid = [];
		for (var i = 0; i < GameGrid.NB_COL * GameGrid.NB_ROW; i++) this.grid.push(i);
	}

	isCellAvailable(row, col) {
		return this.grid.indexOf(this.getCellValue(row, col)) > -1;
	}

	fillCell(row, col) {
		const v = this.getCellValue(row, col);
		this.grid.splice(this.grid.indexOf(v), 1);
	}

	getCellValue(row, col) {
		if (row >= GameGrid.NB_ROW || col >= GameGrid.NB_COL) throw Error('out of the game grid');
		return row * GameGrid.NB_COL + col;
	}

	getCellCoordinate(value) {
		const rowNumber = Math.floor(value / GameGrid.NB_COL);
		return { row: rowNumber, col: value - rowNumber * GameGrid.NB_COL };
	}

	releaseCell(row, col) {
		if (this.isCellAvailable(row, col)) throw Error('cell already available');
		this.grid.push(this.getCellValue(row, col));
	}

	getRandomAvailableCell() {
		if (this.grid.length === 0) throw Error('no cell available');
		const random = Math.random() * 100;
		const availableCellValue = this.grid[random % this.grid.length];
		return this.getCellCoordinate(availableCellValue);
	}
}

module.exports = { GameGrid };
