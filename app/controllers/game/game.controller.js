const GameOrchestratorService = require('../../services/game-orchestrator/game-orchestrator.service');

const GameController = {
	startNewGame(req, res) {
		try {
			GameOrchestratorService.gameStart();
		} catch (e) {
			res.status(401);
		}
		res.send();
	},

	stopCurrentGame(req, res) {
		GameOrchestratorService.gameStop();
		res.send();
	},

	getStatus(req, res) {
		// TODO : Activité 1
	},

	whackAt(req, res) {
		// TODO : Activité 2
	},
};

module.exports = GameController;
