const statusCodes = require("../utilities/statusCodes");
const constructHierarchy = require("../utilities/constructHierarchy");
const { readFile } = require("fs-extra");
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

    let testInstance;
    const getTestInstance = async () => {
        if(!testInstance) {
            const testAppInstance1AppPackage = app.testAppInstance1AppPackage;
            testInstance = await getApisWithFullAccess({}, await testAppInstance1AppPackage(app));
        }
        return testInstance;
    }
    

    let instance2;
    it("should be able to create second instance of app", async () => {
        const version1 = app.apps.testApp1.version1;
        const master = await getmaster();
        instance2 = master.recordApi
                            .getNew(`${app.apps.testApp1.key}/instances`, "instance");
        instance2.name = "instance 2";
        instance2.active = true;
        instance2.version = {key:version1.key, name:"v1", defaultAccessLevel:"owner"};
        
        await app.post(`/_master/api/record/${instance2.key}`, instance2)
                    .set("cookie", app.credentials.masterOwner.cookie)
                    .expect(statusCodes.OK);

        const loadInstanceResponse = await app.get(`/_master/api/record/${instance2.key}`)
                    .set("cookie", app.credentials.masterOwner.cookie)
                    .expect(statusCodes.OK);

        instance2 = loadInstanceResponse.body;
        app.apps.testApp1.instance2 = instance2;

    });

    let user1_instance2;
    it("should be able to create new user on second instance, via master", async () => {
        const master = await getmaster();
        user1_instance2 = master.recordApi  
                        .getNew(`${app.apps.testApp1.key}/users`, "user");
        user1_instance2.name = app.credentials.testAppUser2.username;
        user1_instance2.createdByMaster = true;
        master.recordApi.setCustomId(user1_instance2, user1_instance2.name);

        user1_instance2.instance = instance2;
        user1_instance2.active = true;
        //await timeout(100);
        await app.post(`/_master/api/record/${user1_instance2.key}`, user1_instance2)
                    .set("cookie", app.credentials.masterOwner.cookie)
                    .expect(statusCodes.OK);
    });

    it("should be able to set password for new user using temporary code", async () => {
        const testUserTempCode = await readFile(`./tests/.data/tempaccess${user1_instance2.name}`, "utf8");
        user1_instance2.password = app.credentials.testAppUser2.password;

        await app.post("/testApp/api/setPasswordFromTemporaryCode", {
            username: app.credentials.testAppUser2.username,
            tempCode:testUserTempCode,
            newPassword:app.credentials.testAppUser2.password
        })
        .expect(statusCodes.OK);

        const response = await app.post("/testApp/api/authenticate", {
            username: app.credentials.testAppUser2.username,
            password: app.credentials.testAppUser2.password
        })
        .expect(statusCodes.OK);

        app.credentials.testAppUser2.cookie = response.header['set-cookie'];

    })

    it("should create records in the correct instance", async () => {
        const bb = await getTestInstance();

        const newCustomer = name => {
            const c = bb.recordApi.getNew("/customers", "customer");
            c.name = name;
            return c;
        }

        const customer1 = newCustomer("customer1");
        await app.post(`/testApp/api/record/${customer1.key}`, customer1)
        .set("cookie", app.credentials.testAppUser1.cookie)
        .expect(statusCodes.OK);    

        const customer2 = newCustomer("customer2");
        await app.post(`/testApp/api/record/${customer2.key}`, customer2)
        .set("cookie", app.credentials.testAppUser2.cookie)
        .expect(statusCodes.OK);


        await app.get(`/testApp/api/record/${customer1.key}`)
        .set("cookie", app.credentials.testAppUser1.cookie)
        .expect(statusCodes.OK);

        await app.get(`/testApp/api/record/${customer1.key}`)
        .set("cookie", app.credentials.testAppUser2.cookie)
        .expect(statusCodes.INTERAL_ERROR);

        await app.get(`/testApp/api/record/${customer2.key}`)
        .set("cookie", app.credentials.testAppUser2.cookie)
        .expect(statusCodes.OK);

        await app.get(`/testApp/api/record/${customer2.key}`)
        .set("cookie", app.credentials.testAppUser1.cookie)
        .expect(statusCodes.INTERAL_ERROR);


    });
}