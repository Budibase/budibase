const statusCodes = require("../utilities/statusCodes");
const constructHierarchy = require("../utilities/constructHierarchy");
const { readFile } = require("../utilities/fsawait");
const {getRecordApi, getAuthApi} = require("budibase-core");
const masterAppDefinition = constructHierarchy(
    require("../appPackages/master/appDefinition.json"));
const {getApisWithFullAccess} = require("../utilities/budibaseApi");
const { createTarGzPackage } = require("../utilities/targzAppPackage");

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

        await app.post(`/_master/api/record/${newApp.key}`, newApp)
            .set("cookie", app.masterAuth.cookie)
            .expect(statusCodes.OK);

        const response = await app.get(`/_master/api/record/${newApp.key}`)
            .set("cookie", app.masterAuth.cookie)
            .expect(statusCodes.OK);

        expect(response.body.name).toBe(newApp.name);
    });

    let version1Key = "";
    it("should be able to upload new version including package files", async () => {
        const master = await getmaster();
        const version1 = master.recordApi
                            .getNew(`${newAppKey}/versions`, "version");
        version1.name = "v1";
        version1Key = version1.key;

        const { path, size } = await createTarGzPackage(app.config, "testApp");

        version1.package = { relativePath: "package.tar.gz", size};

        await app.post(`/_master/api/record/${version1.key}`, version1)
                .set("cookie", app.masterAuth.cookie)
                .expect(statusCodes.OK);

        await app.post(`/_master/api/files/${version1.key}`)
                .attach("file", path, "package.tar.gz")
                .set("cookie", app.masterAuth.cookie)
                .expect(statusCodes.OK);

    });

    it("should be able to create new instance of app", async () => {
        const master = await getmaster();
        const instance1 = master.recordApi
                            .getNew(`${newAppKey}/instances`, "instance");
        instance1.name = "instance 1";
        instance1.active = true;
        instance1.version = {key:version1Key, name:"v1"};
        instance1.datastoreconfig;


    });

}