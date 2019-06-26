const statusCodes = require("../utilities/statusCodes");
const util = require("util");
const fs = require("fs");
const readFile = util.promisify(fs.readFile);

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
    let testPassword = "test_user_password";
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

    it("should not be able to perform requests when user is disabled", async () => {

        await app.post("/_master/api/disableUser", {
            username: testUserName
        })
        .set("cookie", ownerCookie)
        .expect(statusCodes.OK);

        await app.get("/_master/api/users/")
            .set("cookie", newUserCookie)
            .expect(statusCodes.UNAUTHORIZED);

        await app.post("/_master/api/authenticate", {
            username: testUserName,
            password: testPassword
        })
        .expect(statusCodes.UNAUTHORIZED);

    });

    it("should not be able to re-authenticate when user is disabled", async () => {
        await app.post("/_master/api/authenticate", {
            username: testUserName,
            password: testPassword
        })
        .expect(statusCodes.UNAUTHORIZED);
    });

    it("should be able with re-authenticate when user is enabled again", async () => {

        await app.post("/_master/api/enableUser", {
            username: testUserName
        })
        .set("cookie", ownerCookie)
        .expect(statusCodes.OK);

        await app.post("/_master/api/authenticate", {
            username: testUserName,
            password: testPassword
        })
        .expect(statusCodes.OK);
    });

    it("should be able to reset password with temporary access", async () => {
        // need to sort out behaviour sources for this...
        await app.post("/_master/api/createTemporaryAccess", {
            username: testUserName
        })
        .expect(statusCodes.OK);

        testPassword = "test_user_new_password";

        const tempCode = await readFile(`./tests/.data/tempaccess${testUserName}`, "utf8");

        await app.post("/_master/api/setPasswordFromTemporaryCode", {
            username: testUserName,
            tempCode,
            newPassword:testPassword
        })
        .expect(statusCodes.OK);

        await app.post("/_master/api/authenticate", {
            username: testUserName,
            password: testPassword
        })
        .expect(statusCodes.OK);

    });
};
