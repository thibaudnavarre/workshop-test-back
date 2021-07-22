const express = require('express');
const GameController = require('./controllers/game/game.controller');

const router = express.Router();

router.post('/game/start', GameController.startNewGame);
router.post('/game/stop', GameController.stopCurrentGame);
router.get('/game/status', GameController.getStatus);
router.post('/game/whack-at', GameController.whackAt);

module.exports = router;
