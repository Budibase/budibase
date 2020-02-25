const statusCodes = require("../utilities/statusCodes")
const constructHierarchy = require("../utilities/constructHierarchy")
const { readFile } = require("fs-extra")
constructHierarchy(require("../appPackages/_master/appDefinition.json"))
const { getApisWithFullAccess } = require("../utilities/budibaseApi")

module.exports = app => {
  let _master
  const getmaster = async () => {
    if (!_master)
      _master = await getApisWithFullAccess({}, app.masterAppPackage)
    return _master
  }

  let testInstance
  const getTestInstance = async () => {
    if (!testInstance) {
      const testAppInstance1AppPackage = app.testAppInstance1AppPackage
      testInstance = await getApisWithFullAccess(
        {},
        await testAppInstance1AppPackage(app)
      )
    }
    return testInstance
  }

  let instance2
  it("should be able to create second instance of app", async () => {
    const version1 = app.apps.testApp1.version1
    const master = await getmaster()
    instance2 = master.recordApi.getNew(
      `${app.apps.testApp1.key}/instances`,
      "instance"
    )
    instance2.name = "instance 2"
    instance2.active = true
    instance2.version = {
      key: version1.key,
      name: "v1",
      defaultAccessLevel: "owner",
    }

    await app
      .post(`/_master/api/record/${instance2.key}`, instance2)
      .set("cookie", app.credentials.masterOwner.cookie)
      .expect(statusCodes.OK)

    const loadInstanceResponse = await app
      .get(`/_master/api/record/${instance2.key}`)
      .set("cookie", app.credentials.masterOwner.cookie)
      .expect(statusCodes.OK)

    instance2 = loadInstanceResponse.body
    app.apps.testApp1.instance2 = instance2
  })

  let user1_instance2
  it("should be able to create new user on second instance, via master", async () => {
    const master = await getmaster()
    user1_instance2 = master.recordApi.getNew(
      `${app.apps.testApp1.key}/users`,
      "user"
    )
    user1_instance2.name = app.credentials.testAppUser2.username
    user1_instance2.createdByMaster = true
    master.recordApi.setCustomId(user1_instance2, user1_instance2.name)

    user1_instance2.instance = instance2
    user1_instance2.active = true
    //await timeout(100);
    await app
      .post(`/_master/api/record/${user1_instance2.key}`, user1_instance2)
      .set("cookie", app.credentials.masterOwner.cookie)
      .expect(statusCodes.OK)
  })

  it("should be able to set password for new user using temporary code", async () => {
    const testUserTempCode = await readFile(
      `./tests/.data/tempaccess${user1_instance2.name}`,
      "utf8"
    )
    user1_instance2.password = app.credentials.testAppUser2.password

    await app
      .post("/testApp/api/setPasswordFromTemporaryCode", {
        username: app.credentials.testAppUser2.username,
        tempCode: testUserTempCode,
        newPassword: app.credentials.testAppUser2.password,
      })
      .expect(statusCodes.OK)

    const response = await app
      .post("/testApp/api/authenticate", {
        username: app.credentials.testAppUser2.username,
        password: app.credentials.testAppUser2.password,
      })
      .expect(statusCodes.OK)

    app.credentials.testAppUser2.cookie = response.header["set-cookie"]
  })

  it("should create records in the correct instance", async () => {
    const bb = await getTestInstance()

    const newCustomer = name => {
      const c = bb.recordApi.getNew("/customers", "customer")
      c.name = name
      return c
    }

    const customer1 = newCustomer("customer1")
    await app
      .post(`/testApp/api/record/${customer1.key}`, customer1)
      .set("cookie", app.credentials.testAppUser1.cookie)
      .expect(statusCodes.OK)

    const customer2 = newCustomer("customer2")
    await app
      .post(`/testApp/api/record/${customer2.key}`, customer2)
      .set("cookie", app.credentials.testAppUser2.cookie)
      .expect(statusCodes.OK)

    await app
      .get(`/testApp/api/record/${customer1.key}`)
      .set("cookie", app.credentials.testAppUser1.cookie)
      .expect(statusCodes.OK)

    await app
      .get(`/testApp/api/record/${customer1.key}`)
      .set("cookie", app.credentials.testAppUser2.cookie)
      .expect(statusCodes.INTERAL_ERROR)

    await app
      .get(`/testApp/api/record/${customer2.key}`)
      .set("cookie", app.credentials.testAppUser2.cookie)
      .expect(statusCodes.OK)

    await app
      .get(`/testApp/api/record/${customer2.key}`)
      .set("cookie", app.credentials.testAppUser1.cookie)
      .expect(statusCodes.INTERAL_ERROR)
  })

  let versionlessInstance
  it("should be able to create a versionless instance", async () => {
    const master = await getmaster()
    versionlessInstance = master.recordApi.getNew(
      `${app.apps.testApp1.key}/instances`,
      "instance"
    )
    versionlessInstance.name = "versionless instance"
    versionlessInstance.active = true
    versionlessInstance.version = { key: "", defaultAccessLevel: "owner" }

    await app
      .post(
        `/_master/api/record/${versionlessInstance.key}`,
        versionlessInstance
      )
      .set("cookie", app.credentials.masterOwner.cookie)
      .expect(statusCodes.OK)

    const loadInstanceResponse = await app
      .get(`/_master/api/record/${versionlessInstance.key}`)
      .set("cookie", app.credentials.masterOwner.cookie)
      .expect(statusCodes.OK)

    versionlessInstance = loadInstanceResponse.body
    app.apps.testApp1.versionlessInstance = versionlessInstance
  })

  let user1_versionlessInstance
  it("should be able to create new user on versionless, via master", async () => {
    const master = await getmaster()
    user1_versionlessInstance = master.recordApi.getNew(
      `${app.apps.testApp1.key}/users`,
      "user"
    )
    user1_versionlessInstance.name =
      app.credentials.user1_versionlessInstance.username
    user1_versionlessInstance.createdByMaster = true
    master.recordApi.setCustomId(
      user1_versionlessInstance,
      user1_versionlessInstance.name
    )

    user1_versionlessInstance.instance = versionlessInstance
    user1_versionlessInstance.active = true
    //await timeout(100);
    await app
      .post(
        `/_master/api/record/${user1_versionlessInstance.key}`,
        user1_versionlessInstance
      )
      .set("cookie", app.credentials.masterOwner.cookie)
      .expect(statusCodes.OK)

    const testUserTempCode = await readFile(
      `./tests/.data/tempaccess${user1_versionlessInstance.name}`,
      "utf8"
    )
    user1_versionlessInstance.password =
      app.credentials.user1_versionlessInstance.password

    await app
      .post("/testApp/api/setPasswordFromTemporaryCode", {
        username: app.credentials.user1_versionlessInstance.username,
        tempCode: testUserTempCode,
        newPassword: app.credentials.user1_versionlessInstance.password,
      })
      .expect(statusCodes.OK)

    const response = await app
      .post("/testApp/api/authenticate", {
        username: app.credentials.user1_versionlessInstance.username,
        password: app.credentials.user1_versionlessInstance.password,
      })
      .expect(statusCodes.OK)

    app.credentials.user1_versionlessInstance.cookie =
      response.header["set-cookie"]
  })
}
