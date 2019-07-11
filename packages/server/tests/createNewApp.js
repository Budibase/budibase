const statusCodes = require("../utilities/statusCodes");
const constructHierarchy = require("../utilities/constructHierarchy");
const { readFile } = require("../utilities/fsawait");
const {getRecordApi, getAuthApi} = require("budibase-core");
const masterAppDefinition = constructHierarchy(
    require("../appPackages/master/appDefinition.json"));
const {getApisWithFullAccess} = require("../utilities/budibaseApi");
const { createTarGzPackage } = require("../utilities/targzAppPackage");
const { timeout } = require("./helpers");

module.exports = (app) => {

    let _master;
    const getmaster = async () => {
        if(!_master)
            _master = await getApisWithFullAccess({}, app.masterAppPackage);
        return _master;
    }
    
    let newAppKey = "";
    it("create new application should be successful for owner", async () => {       
        const master = await getmaster();
        const newApp =  master.recordApi.getNew("/applications", "application");
        newApp.name = app.testAppInfo.name
        newAppKey = newApp.key;
        app.apps.testApp1.key = newAppKey;
        await app.post(`/_master/api/record/${newApp.key}`, newApp)
            .set("cookie", app.credentials.masterOwner.cookie)
            .expect(statusCodes.OK);

        const response = await app.get(`/_master/api/record/${newApp.key}`)
            .set("cookie", app.credentials.masterOwner.cookie)
            .expect(statusCodes.OK);

        expect(response.body.name).toBe(newApp.name);
    });

    let version1Key = "";
    it("should be able to upload new version including package files", async () => {
        const master = await getmaster();
        const version1 = master.recordApi
                            .getNew(`${newAppKey}/versions`, "version");
        version1.name = "v1";
        version1.defaultAccessLevel = "owner";
        version1Key = version1.key;

        const { path, size } = await createTarGzPackage(app.config, "testApp");

        version1.package = { relativePath: "package.tar.gz", size};

        await app.post(`/_master/api/record/${version1.key}`, version1)
                .set("cookie", app.credentials.masterOwner.cookie)
                .expect(statusCodes.OK);

        await app.post(`/_master/api/files/${version1.key}`)
                .attach("file", path, "package.tar.gz")
                .set("cookie", app.credentials.masterOwner.cookie)
                .expect(statusCodes.OK);

        app.apps.testApp1.version1 = version1;

    });

    let instance1;
    it("should be able to create new instance of app", async () => {
        const master = await getmaster();
        instance1 = master.recordApi
                            .getNew(`${newAppKey}/instances`, "instance");
        instance1.name = "instance 1";
        instance1.active = true;
        instance1.version = {key:version1Key, name:"v1", defaultAccessLevel:"owner"};
        
        await app.post(`/_master/api/record/${instance1.key}`, instance1)
                    .set("cookie", app.credentials.masterOwner.cookie)
                    .expect(statusCodes.OK);

        const loadInstanceResponse = await app.get(`/_master/api/record/${instance1.key}`)
                    .set("cookie", app.credentials.masterOwner.cookie)
                    .expect(statusCodes.OK);

        instance1 = loadInstanceResponse.body;
        app.apps.testApp1.instance1 = instance1;

    });

    let user1_instance1;
    it("should be able to create new user on instance, via master", async () => {
        const master = await getmaster();
        user1_instance1 = master.recordApi  
                        .getNew(`${newAppKey}/users`, "user");
        user1_instance1.name = app.credentials.testAppUser1.username;
        user1_instance1.createdByMaster = true;
        master.recordApi.setCustomId(user1_instance1, user1_instance1.name);
        /*const lookupResponse = await app.get(`/_master/api/lookup_field/${user1_instance1.key}?fields=instance`)
                .set("cookie", app.credentials.masterOwner.cookie)
                .expect(statusCodes.OK);
        */
        user1_instance1.instance = instance1;
        user1_instance1.active = true;
        //await timeout(100);
        await app.post(`/_master/api/record/${user1_instance1.key}`, user1_instance1)
                    .set("cookie", app.credentials.masterOwner.cookie)
                    .expect(statusCodes.OK);
    });

    it("should be able to set password for new user using temporary code", async () => {
        const testUserTempCode = await readFile(`./tests/.data/tempaccess${user1_instance1.name}`, "utf8");
        user1_instance1.password = app.credentials.testAppUser1.password;

        await app.post("/testApp/api/setPasswordFromTemporaryCode", {
            username: app.credentials.testAppUser1.username,
            tempCode:testUserTempCode,
            newPassword:app.credentials.testAppUser1.password
        })
        .expect(statusCodes.OK);

        const response = await app.post("/testApp/api/authenticate", {
            username: app.credentials.testAppUser1.username,
            password: app.credentials.testAppUser1.password
        })
        .expect(statusCodes.OK);

        app.credentials.testAppUser1.cookie = response.header['set-cookie'];
    })
}