const CouchDB = require("../../../db")
const supertest = require("supertest")
const {
  POWERUSER_LEVEL_ID,
  ANON_LEVEL_ID,
  BUILDER_LEVEL_ID,
  generateAdminPermissions,
} = require("../../../utilities/accessLevels")
const packageJson = require("../../../../package")
const jwt = require("jsonwebtoken")
const env = require("../../../environment")

const TEST_CLIENT_ID = "test-client-id"

exports.TEST_CLIENT_ID = TEST_CLIENT_ID
exports.supertest = async () => {
  let request
  let app
  env.PORT = 4002
  app = require("../../../app")

  request = supertest(app)
  return { request, app }
}

exports.defaultHeaders = instanceId => {
  const builderUser = {
    userId: "BUILDER",
    accessLevelId: BUILDER_LEVEL_ID,
    instanceId,
  }

  const builderToken = jwt.sign(builderUser, env.JWT_SECRET)

  return {
    Accept: "application/json",
    Cookie: [`builder:token=${builderToken}`],
  }
}

exports.createTable = async (request, instanceId, table) => {
  if (table != null && table._id) {
    delete table._id
  }
  table = table || {
    name: "TestTable",
    type: "table",
    key: "name",
    schema: {
      name: {
        type: "string",
        constraints: {
          type: "string",
        },
      },
      description: {
        type: "string",
        constraints: {
          type: "string",
        },
      },
    },
  }

  const res = await request
    .post(`/api/tables`)
    .set(exports.defaultHeaders(instanceId))
    .send(table)
  return res.body
}

exports.getAllFromTable = async (request, instanceId, tableId) => {
  const res = await request
    .get(`/api/${tableId}/rows`)
    .set(exports.defaultHeaders(instanceId))
  return res.body
}

exports.createView = async (request, instanceId, tableId, view) => {
  view = view || {
    map: "function(doc) { emit(doc[doc.key], doc._id); } ",
    tableId: tableId,
  }

  const res = await request
    .post(`/api/views`)
    .set(exports.defaultHeaders(instanceId))
    .send(view)
  return res.body
}

exports.createApplication = async (request, name = "test_application") => {
  const res = await request
    .post("/api/applications")
    .send({
      name,
    })
    .set(exports.defaultHeaders())
  return res.body
}

exports.clearApplications = async request => {
  const res = await request
    .get("/api/applications")
    .set(exports.defaultHeaders())
  for (let app of res.body) {
    const appId = app._id
    await request.delete(`/api/${appId}`).set(exports.defaultHeaders(appId))
  }
}

exports.createInstance = async request => {
  const res = await request
    .post(`/api/instances`)
    .send({
      name: "test-instance2",
    })
    .set(exports.defaultHeaders())
  return res.body
}

exports.createUser = async (
  request,
  instanceId,
  username = "babs",
  password = "babs_password"
) => {
  const res = await request
    .post(`/api/users`)
    .set(exports.defaultHeaders(instanceId))
    .send({
      name: "Bill",
      username,
      password,
      accessLevelId: POWERUSER_LEVEL_ID,
    })
  return res.body
}

const createUserWithOnePermission = async (
  request,
  instanceId,
  permName,
  itemId
) => {
  let permissions = await generateAdminPermissions(instanceId)
  permissions = permissions.filter(
    p => p.name === permName && p.itemId === itemId
  )

  return await createUserWithPermissions(
    request,
    instanceId,
    permissions,
    "onePermOnlyUser"
  )
}

const createUserWithAdminPermissions = async (request, instanceId) => {
  let permissions = await generateAdminPermissions(instanceId)

  return await createUserWithPermissions(
    request,
    instanceId,
    permissions,
    "adminUser"
  )
}

const createUserWithAllPermissionExceptOne = async (
  request,
  instanceId,
  permName,
  itemId
) => {
  let permissions = await generateAdminPermissions(instanceId)
  permissions = permissions.filter(
    p => !(p.name === permName && p.itemId === itemId)
  )

  return await createUserWithPermissions(
    request,
    instanceId,
    permissions,
    "allPermsExceptOneUser"
  )
}

const createUserWithPermissions = async (
  request,
  instanceId,
  permissions,
  username
) => {
  const accessRes = await request
    .post(`/api/accesslevels`)
    .send({ name: "TestLevel", permissions })
    .set(exports.defaultHeaders(instanceId))

  const password = `password_${username}`
  await request
    .post(`/api/users`)
    .set(exports.defaultHeaders(instanceId))
    .send({
      name: username,
      username,
      password,
      accessLevelId: accessRes.body._id,
    })

  const anonUser = {
    userId: "ANON",
    accessLevelId: ANON_LEVEL_ID,
    instanceId: instanceId,
    version: packageJson.version,
  }

  const anonToken = jwt.sign(anonUser, env.JWT_SECRET)

  const loginResult = await request
    .post(`/api/authenticate`)
    .set({ Cookie: `budibase:token=${anonToken}` })
    .send({ username, password })

  // returning necessary request headers
  return {
    Accept: "application/json",
    Cookie: loginResult.headers["set-cookie"],
  }
}

exports.testPermissionsForEndpoint = async ({
  request,
  method,
  url,
  body,
  instanceId,
  permissionName,
  itemId,
}) => {
  const headers = await createUserWithOnePermission(
    request,
    instanceId,
    permissionName,
    itemId
  )

  await createRequest(request, method, url, body)
    .set(headers)
    .expect(200)

  const noPermsHeaders = await createUserWithAllPermissionExceptOne(
    request,
    instanceId,
    permissionName,
    itemId
  )

  await createRequest(request, method, url, body)
    .set(noPermsHeaders)
    .expect(403)
}

exports.builderEndpointShouldBlockNormalUsers = async ({
  request,
  method,
  url,
  body,
  instanceId,
}) => {
  const headers = await createUserWithAdminPermissions(request, instanceId)

  await createRequest(request, method, url, body)
    .set(headers)
    .expect(403)
}

const createRequest = (request, method, url, body) => {
  let req

  if (method === "POST") req = request.post(url).send(body)
  else if (method === "GET") req = request.get(url)
  else if (method === "DELETE") req = request.delete(url)
  else if (method === "PATCH") req = request.patch(url).send(body)
  else if (method === "PUT") req = request.put(url).send(body)

  return req
}

exports.insertDocument = async (databaseId, document) => {
  const { id, ...documentFields } = document
  return await new CouchDB(databaseId).put({ _id: id, ...documentFields })
}

exports.destroyDocument = async (databaseId, documentId) => {
  return await new CouchDB(databaseId).destroy(documentId)
}

exports.getDocument = async (databaseId, documentId) => {
  return await new CouchDB(databaseId).get(documentId)
}
