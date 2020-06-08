const mongoose = require('mongoose');
const config = require('../../config');


const cleanUpDb = async() => {
    // clean your database here
}

beforeAll( async() => {
    if(mongoose.connection.readyState === 0) {
        var mongoDB = 'mongodb://' + config.mongodb.host + ':' + config.mongodb.port + '/' + config.mongodb.db;
        mongoose.connect(mongoDB, { useNewUrlParser: true })
            .then(()=> {})
            .catch((e)=> console.error("DB error !", e));
    }
    await cleanUpDb();
});

afterAll( async() => {
    await cleanUpDb();
    mongoose.connection.close()
        .then(()=> {})
        .catch((e)=> console.error("DB closing error !", e));
});