const GameOrchestratorService = require('../game-orchestrator/game-orchestrator.service');
const NoGameRunningError = require('./NoGameRunningError');
const { AvailabilityError } = require('../game-orchestrator/game-grid/game-errors');
const ScoringCalculatorSercice = require('../scoring-calculator/scoring-calculator');

const GameService = {
	currentGameGridInstance: null,

	gameStart() {
		this.currentGameGridInstance = GameOrchestratorService.gameStart();
		ScoringCalculatorSercice.reset();
	},

	gameStop() {
		GameOrchestratorService.gameStop();
	},

	whackAt(row, col) {
		if (!this.currentGameGridInstance || !GameOrchestratorService.isGameRunning()) throw new NoGameRunningError();
		try {
			this.currentGameGridInstance.deleteMole(row, col);
			ScoringCalculatorSercice.addWhackedPoint();
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

	getScore() {
		return ScoringCalculatorSercice.getScore();
	},
};

module.exports = GameService;
