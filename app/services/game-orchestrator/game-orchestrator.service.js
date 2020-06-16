const { GameGrid } = require('./game-grid/game-grid');

let isRunning = false;
let moles = [];
let currentTimer = null;
let gameGrid;
let gameTicks;

const GameOrchestratorService = {
	NB_GAME_TICK: 10,
	TICK_TIME: 2000,
	NB_TICK_MOLE_DELETION: 2,

	gameStart() {
		if (isRunning) throw Error('game is already running');
		isRunning = true;
		gameGrid = new GameGrid();
		moles = [];
		gameTicks = 0;
		currentTimer = this.moleGenerationStart();
	},

	moleGenerationStart() {
		return setTimeout(() => {
			const nmole = gameGrid.getRandomAvailableCell();
			gameGrid.fillCell(nmole.row, nmole.col);
			moles.push({ position: nmole, tickGeneration: gameTicks++ });
			if (moles[0].tickGeneration < gameTicks - this.NB_TICK_MOLE_DELETION) {
				gameGrid.releaseCell(moles[0].position.row, moles[0].position.col);
				moles = moles.splice(1, moles.length);
			}
			if (gameTicks < 10) currentTimer = this.moleGenerationStart();
			else this.gameStop();
		}, this.TICK_TIME);
	},

	gameStop() {
		isRunning = false;
		clearTimeout(currentTimer);
	},

	isGameRunning() {
		return isRunning;
	},

	getMoles() {
		return moles;
	},

	whackAt(row, col) {
		if (!isRunning) throw Error('you cannot whack when the game is not running');
		moles = moles.filter((e) => e.position.row !== row && e.position.col !== col);
		gameGrid.releaseCell(row, col);
	},
};

module.exports = GameOrchestratorService;