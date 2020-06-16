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
};

module.exports = GameController;
