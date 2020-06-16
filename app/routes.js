const express = require('express');
const GameController = require('./controllers/game/game.controller');

const router = express.Router();

router.get('/game/start', GameController.startNewGame);
router.get('/game/stop', GameController.stopCurrenGame);

module.exports = router;
