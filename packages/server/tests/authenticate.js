const statusCodes = require("../utilities/statusCodes");

module.exports = (app) => {

    it("should return ok correct username and password supplied", async () => {

        await app.post("/_master/api/authenticate", {
            username: app.masterAuth.username,
            password: app.masterAuth.password
        })
        .expect(statusCodes.OK);
    });

    it("should return unauthorized if username is incorrect", async () => {
        await app.post("/_master/api/authenticate", {
            username: "unknownuser",
            password: app.masterAuth.password
        })
        .expect(statusCodes.UNAUTHORIZED); 
    })

    it("should return unauthorized if password is incorrect", async () => {
        await app.post("/_master/api/authenticate", {
            username: app.masterAuth.username,
            password: "incorrect_password"
        })
        .expect(statusCodes.UNAUTHORIZED); 
    })

    it("should not get cookie when unauthorized", async () => {
        const response = await app.post("/_master/api/authenticate", {
            username: app.masterAuth.username,
            password: "incorrect_password"
        });
        
        expect(response.header['set-cookie']).toBeUndefined();

    });

    it("should be able to create new user with authenticated cookie", async () => {
        const response = await app.post("/_master/api/authenticate", {
            username: app.masterAuth.username,
            password: app.masterAuth.password
        });
        
        const cookie = response.header['set-cookie'];
        
        await app.post("/_master/api/createUser", {
            user: {
                name: "test_user", 
                accessLevels:["owner"], 
                enabled:true
            
            },
            password: "test_password"
        })
        .set("cookie", cookie)
        .expect(statusCodes.OK);

        const responseNewUser = await app.post("/_master/api/authenticate", {
            username: "test_user",
            password: "test_password"
        });
        
        const newUserCookie = responseNewUser.header['set-cookie'];

        expect(newUserCookie).toBeDefined();
        expect(newUserCookie).not.toEqual(cookie);
    });
};
