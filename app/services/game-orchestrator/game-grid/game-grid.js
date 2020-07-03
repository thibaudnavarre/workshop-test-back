class GameGrid {
	static NB_ROW = 4;

	static NB_COL = 4;

	constructor() {
		this.cellsAvailable = [];
		this.moles = [];
		let i = 0;
		for (; i < GameGrid.NB_COL * GameGrid.NB_ROW; i += 1) this.cellsAvailable.push(i);
	}

	isCellAvailable(row, col) {
		return this.cellsAvailable.indexOf(GameGrid.getCellValue(row, col)) > -1;
	}

	addMole(row, col, tick) {
		if (!this.isCellAvailable(row, col)) throw Error('cell is not available');
		const value = GameGrid.getCellValue(row, col);
		this.moles.push({ position: { row, col }, tickGeneration: tick });
		this.cellsAvailable.splice(this.cellsAvailable.indexOf(value), 1);
	}

	static getCellValue(row, col) {
		if (!GameGrid.isPositionInTable(row, col)) throw Error('out of the game grid');
		return row * GameGrid.NB_COL + col;
	}

	static getCellCoordinates(value) {
		const rowNumber = Math.floor(value / GameGrid.NB_COL);
		return { row: rowNumber, col: value - rowNumber * GameGrid.NB_COL };
	}

	deleteMole(row, col) {
		if (this.moles.length === 0) throw Error('no mole to delete');
		if (this.isCellAvailable(row, col)) throw Error('cell already available');
		this.cellsAvailable.push(GameGrid.getCellValue(row, col));
		this.moles = this.moles.filter((element) => element.position.row !== row && element.position.col !== col);
	}

	getRandomAvailableCell() {
		if (this.cellsAvailable.length === 0) throw Error('no cell available');
		const random = Math.random() * 100;
		const availableCellValue = this.cellsAvailable[random % this.cellsAvailable.length];
		return GameGrid.getCellCoordinates(availableCellValue);
	}

	getMoles() {
		return this.moles;
	}

	generateNewMole(tick) {
		const cellAvailable = this.getRandomAvailableCell();
		this.addMole(cellAvailable.row, cellAvailable.col, tick);
	}

	static isPositionInTable(row, col) {
		return row >= 0 && row < GameGrid.NB_ROW && col >= 0 && col < GameGrid.NB_COL;
	}
}

module.exports = { GameGrid };
