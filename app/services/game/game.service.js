const GameOrchestratorService = require('../game-orchestrator/game-orchestrator.service');
const NoGameRunningError = require('./NoGameRunningError');
const { AvailabilityError } = require('../game-orchestrator/game-grid/game-errors');

const GameService = {
	currentGameGridInstance: null,

	gameStart() {
		this.currentGameGridInstance = GameOrchestratorService.gameStart();
	},

	gameStop() {
		GameOrchestratorService.gameStop();
	},

	whackAt(row, col) {
		if (!this.currentGameGridInstance || !GameOrchestratorService.isGameRunning()) throw new NoGameRunningError();
		try {
			this.currentGameGridInstance.deleteMole(row, col);
		} catch (error) {
			if (!(error instanceof AvailabilityError)) throw error;
		}
	},

	isGameRunning() {
		return GameOrchestratorService.isGameRunning();
	},

	getMoles() {
		return this.currentGameGridInstance ? this.currentGameGridInstance.getMoles() : [];
	},
};

module.exports = GameService;
