const GameService = require('../../services/game/game.service');

const GameController = {
	startNewGame(req, res) {
		try {
			GameService.gameStart();
		} catch (e) {
			res.status(401);
		}
		res.send();
	},

	stopCurrentGame(req, res) {
		GameService.gameStop();
		res.send();
	},

	getStatus(req, res) {
		const isRunning = GameService.isGameRunning();
		const moles = GameService.getMoles();

		res.json({ moles, status: isRunning });
	},

	whackAt(req, res) {
		// TODO : Activité 2
	},
};

module.exports = GameController;
