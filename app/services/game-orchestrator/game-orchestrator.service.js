const { GameGrid } = require('./game-grid/game-grid');

let isRunning = false;
let currentTimer = null;
let gameGrid;
let gameTicks;

const GameOrchestratorService = {
	NB_GAME_TICK: 10,
	TICK_DURATION: 2000,
	NB_TICK_MOLE_DELETION: 2,

	gameStart() {
		if (isRunning) throw Error('game is already running');
		isRunning = true;
		gameGrid = new GameGrid();
		gameTicks = 0;
		currentTimer = this.moleGenerationLoop();
		return gameGrid;
	},

	moleGenerationLoop() {
		return setTimeout(() => {
			gameGrid.generateNewMole(gameTicks);
			gameTicks += 1;
			const moles = gameGrid.getMoles();
			moles.forEach((mole) => {
				if (mole.tickGeneration < gameTicks - this.NB_TICK_MOLE_DELETION) {
					gameGrid.deleteMole(mole.position.row, mole.position.col);
				}
			});
			if (gameTicks < this.NB_GAME_TICK) currentTimer = this.moleGenerationLoop();
			else this.gameStop();
		}, this.TICK_DURATION);
	},

	gameStop() {
		isRunning = false;
		clearTimeout(currentTimer);
	},

	isGameRunning() {
		return isRunning;
	},
};

module.exports = GameOrchestratorService;
