const request = require('supertest');
const app = require("./testApp")();
const statusCodes = require("../utilities/statusCodes");


describe("authenticate master", () => {
    beforeAll(() => {
        return app.start();
    })

    afterAll(() => {
        app.server.destroy();
    })

    it("should return ok correct username and password supplied", () => {

        app.post("/_master/authenticate", {
            username: app.masterAuth.username,
            password: app.masterAuth.password
        })
        .expect(statusCodes.OK);        

    });

    it("should return unauthorized if username is incorrect", () => {
        app.post("/_master/authenticate", {
            username: "unknownuser",
            password: app.masterAuth.password
        })
        .expect(statusCodes.UNAUTHORIZED); 
    })

    it("should return unauthorized if password is incorrect", () => {
        app.post("/_master/authenticate", {
            username: app.masterAuth.username,
            password: app.masterAuth.password
        })
        .expect(statusCodes.UNAUTHORIZED); 
    })
})

