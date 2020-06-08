const DefaultController = require('./default.controller')

describe('default.controller', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {body: {}}
        res = {
            json: jest.fn(),
            send: jest.fn(),
            status: jest.fn()
        }
        res.status.mockReturnValue(res);
    });

    describe('getHelloWorld', () => {

        it('should return "Hello World" in a json format', () => {
            DefaultController.getHelloWorld(req,res);
            expect(res.json).toBeCalledWith('Hello World');
        })
    });
});
