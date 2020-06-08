const express = require('express');
const DefaultController = require('./controllers/auth/default.controller')

const router = express.Router();

router.get('/helloworld', DefaultController.getHelloWorld);

module.exports = router;
