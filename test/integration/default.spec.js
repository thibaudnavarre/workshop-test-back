const request = require('request-promise-native');
const Validator = require('jsonschema').Validator;
const HelloworldResponseSchema = require('./schemas/default/helloworld-response');
const config = require('../../config');

const BASE_URI = 'http://localhost:'+config.app.port;

describe('default', () => {
    let reqOptions;
    const validator = new Validator();

    beforeEach(() => {
        reqOptions = {
            json: true
        }
    });

    describe('/helloworld', () => {
        
        beforeEach(() => {
            reqOptions.uri = BASE_URI+'/helloworld';
            reqOptions.method = 'GET';
        });

        it('should return a token', async() => {
            let res = await request(reqOptions);
            expect(validator.validate(res,HelloworldResponseSchema).errors.length).toEqual(0);
        });
    });
});