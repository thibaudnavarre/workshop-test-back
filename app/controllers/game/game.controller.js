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
		if (!Number.isNaN(parseInt(req.body.row, 10)) && !Number.isNan(parseInt(req.body.col, 10))) {
			try {
				GameService.whackAt(req.body.row, req.body.col);
			} catch (e) {
				res.status(401);
			}
		} else {
			res.status(401);
		}
		res.send();
	},
};

module.exports = GameController;
