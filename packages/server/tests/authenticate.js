const statusCodes = require("../utilities/statusCodes");

module.exports = (app) => {

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

    let ownerCookie;
    it("should return ok correct username and password supplied", async () => {

        const response = await app.post("/_master/api/authenticate", {
            username: app.masterAuth.username,
            password: app.masterAuth.password
        })
        .expect(statusCodes.OK);

        ownerCookie = response.header['set-cookie'];
    });

    const testUserName = "test_user";
    const testPassword = "test_user_password";
    it("should be able to create new user with authenticated cookie", async () => {
                
        await app.post("/_master/api/createUser", {
            user: {
                name: testUserName, 
                accessLevels:["owner"], 
                enabled:true
            
            },
            password: testPassword
        })
        .set("cookie", ownerCookie)
        .expect(statusCodes.OK);

        
    });

    let newUserCookie;
    it("should be able to authenticate with new user", async () => {

        const responseNewUser = await app.post("/_master/api/authenticate", {
            username: testUserName,
            password: testPassword
        })
        .expect(statusCodes.OK);
        
        newUserCookie = responseNewUser.header['set-cookie'];

        expect(newUserCookie).toBeDefined();
        expect(newUserCookie).not.toEqual(ownerCookie);

        app.get("/_master/api/users/")
        .set("cookie", newUserCookie)
        .expect(statusCodes.OK);
    });

    
};
