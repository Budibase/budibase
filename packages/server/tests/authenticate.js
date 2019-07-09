const statusCodes = require("../utilities/statusCodes");
const { readFile } = require("../utilities/fsawait");
const { timeout } = require("./helpers");

module.exports = (app, appName) => {

    const credentials = app.credentials[appName];

    it("should return unauthorized if username is incorrect", async () => {
        await app.post(`/${appName}/api/authenticate`, {
            username: "unknownuser",
            password: credentials.password
        })
        .expect(statusCodes.UNAUTHORIZED); 
    })

    it("should return unauthorized if password is incorrect", async () => {
        await app.post(`/${appName}/api/authenticate`, {
            username: credentials.username,
            password: "incorrect_password"
        })
        .expect(statusCodes.UNAUTHORIZED); 
    })

    it("should not get cookie when unauthorized", async () => {
        const response = await app.post(`/${appName}/api/authenticate`, {
            username: credentials.username,
            password: "incorrect_password"
        });
        
        expect(response.header['set-cookie']).toBeUndefined();

    });

    it("should return ok correct username and password supplied", async () => {

        const response = await app.post(`/${appName}/api/authenticate`, {
            username: credentials.username,
            password: credentials.password
        })
        .expect(statusCodes.OK);

        credentials.cookie = response.header['set-cookie'];
    });

    const testUserName = appName + "_test_user";
    let testPassword = "test_user_password";
    it("should be able to create new user with authenticated cookie", async () => {
                
        await app.post(`/${appName}/api/createUser`, {
            user: {
                name: testUserName, 
                accessLevels:["owner"], 
                enabled:true
            },
            password: testPassword
        })
        .set("cookie", credentials.cookie)
        .expect(statusCodes.OK);

        
    });

    let newUserCookie;
    it("should be able to authenticate with new user", async () => {

        const responseNewUser = await app.post(`/${appName}/api/authenticate`, {
            username: testUserName,
            password: testPassword
        })
        .expect(statusCodes.OK);
        
        newUserCookie = responseNewUser.header['set-cookie'];

        expect(newUserCookie).toBeDefined();
        expect(newUserCookie).not.toEqual(credentials.cookie);

        app.get("/_master/api/users/")
        .set("cookie", newUserCookie)
        .expect(statusCodes.OK);
    });

    it("should not be able to perform requests when user is disabled", async () => {

        //HERE
        await app.post(`/${appName}/api/disableUser`, {
            username: testUserName
        })
        .set("cookie", credentials.cookie)
        .expect(statusCodes.OK);

        await app.get(`/${appName}/api/users`)
            .set("cookie", newUserCookie)
            .expect(statusCodes.UNAUTHORIZED);

        await app.post(`/${appName}/api/authenticate`, {
            username: testUserName,
            password: testPassword
        })
        .expect(statusCodes.UNAUTHORIZED);

    });

    it("should not be able to re-authenticate when user is disabled", async () => {
        await app.post(`/${appName}/api/authenticate`, {
            username: testUserName,
            password: testPassword
        })
        .expect(statusCodes.UNAUTHORIZED);
    });

    it("should be able with re-authenticate when user is enabled again", async () => {

        await app.post(`/${appName}/api/enableUser`, {
            username: testUserName
        })
        .set("cookie", credentials.cookie)
        .expect(statusCodes.OK);

        await app.post(`/${appName}/api/authenticate`, {
            username: testUserName,
            password: testPassword
        })
        .expect(statusCodes.OK);
    });

    let testUserTempCode;
    it("should be able to reset password with temporary access", async () => {

        await app.post(`/${appName}/api/createTemporaryAccess`, {
            username: testUserName
        })
        .expect(statusCodes.OK);

        testPassword = "test_user_new_password";

        // the behaviour that creates the below file is async,
        /// to this timeout is giving it a change to work its magic        
        await timeout(10);

        const testUserTempCode = await readFile(`./tests/.data/tempaccess${testUserName}`, "utf8");
    
        await app.post(`/${appName}/api/setPasswordFromTemporaryCode`, {
            username: testUserName,
            tempCode:testUserTempCode,
            newPassword:testPassword
        })
        .expect(statusCodes.OK);

        await app.post(`/${appName}/api/authenticate`, {
            username: testUserName,
            password: testPassword
        })
        .expect(statusCodes.OK);

        

    });

    it("should not be able to set password with used temp code", async () => {
      
        await app.post(`/${appName}/api/setPasswordFromTemporaryCode`, {
            username: testUserName,
            tempCode:testUserTempCode,
            newPassword:"whatever"
        })
        .expect(statusCodes.OK);

        await app.post(`/${appName}/api/authenticate`, {
            username: testUserName,
            password: "whatever"
        })
        .expect(statusCodes.UNAUTHORIZED);

        await app.post(`/${appName}/api/authenticate`, {
            username: testUserName,
            password: testPassword
        })
        .expect(statusCodes.OK);

    });
};
