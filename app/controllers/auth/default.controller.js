const { json } = require("body-parser");

const DefaultController = {

    getHelloWorld(req, res) {
        res.json('Hello World');
    }
}

module.exports = DefaultController;