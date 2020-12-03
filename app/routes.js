const express = require('express');
const GameController = require('./controllers/game/game.controller');

const router = express.Router();

router.get('/game/start', GameController.startNewGame);
router.get('/game/stop', GameController.stopCurrentGame);
router.get('/game/status', GameController.getStatus);
router.post('/game/whack-at', GameController.whackAt);

module.exports = router;
