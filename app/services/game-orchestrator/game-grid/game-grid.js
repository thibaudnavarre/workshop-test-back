class GameGrid {
	static NB_ROW = 4;

	static NB_COL = 4;

	constructor() {
		this.cellsAvailable = [];
		let i = 0;
		for (; i < GameGrid.NB_COL * GameGrid.NB_ROW; i += 1) this.cellsAvailable.push(i);
	}

	isCellAvailable(row, col) {
		return this.cellsAvailable.indexOf(GameGrid.getCellValue(row, col)) > -1;
	}

	fillCell(row, col) {
		const value = GameGrid.getCellValue(row, col);
		this.cellsAvailable.splice(this.cellsAvailable.indexOf(value), 1);
	}

	static getCellValue(row, col) {
		if (row >= GameGrid.NB_ROW || col >= GameGrid.NB_COL) throw Error('out of the game grid');
		return row * GameGrid.NB_COL + col;
	}

	static getCellCoordinate(value) {
		const rowNumber = Math.floor(value / GameGrid.NB_COL);
		return { row: rowNumber, col: value - rowNumber * GameGrid.NB_COL };
	}

	releaseCell(row, col) {
		if (this.isCellAvailable(row, col)) throw Error('cell already available');
		this.cellsAvailable.push(GameGrid.getCellValue(row, col));
	}

	getRandomAvailableCell() {
		if (this.cellsAvailable.length === 0) throw Error('no cell available');
		const random = Math.random() * 100;
		const availableCellValue = this.cellsAvailable[random % this.cellsAvailable.length];
		return GameGrid.getCellCoordinate(availableCellValue);
	}
}

module.exports = { GameGrid };
