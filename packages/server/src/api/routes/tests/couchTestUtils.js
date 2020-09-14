const CouchDB = require("../../../db")
const { create, destroy } = require("../../../db/clientDb")
const supertest = require("supertest")
const {
  POWERUSER_LEVEL_ID,
  ANON_LEVEL_ID,
  BUILDER_LEVEL_ID,
  generateAdminPermissions,
} = require("../../../utilities/accessLevels")
const jwt = require("jsonwebtoken")
const env = require("../../../environment")

const TEST_CLIENT_ID = "test-client-id"

exports.TEST_CLIENT_ID = TEST_CLIENT_ID
exports.supertest = async () => {
  let request
  let server
  process.env.PORT = 4002
  server = require("../../../app")

  request = supertest(server)
  return { request, server }
}

exports.defaultHeaders = (appId, instanceId) => {
  const builderUser = {
    userId: "BUILDER",
    accessLevelId: BUILDER_LEVEL_ID,
    appId,
    instanceId,
  }

  const builderToken = jwt.sign(builderUser, env.JWT_SECRET)

  return {
    Accept: "application/json",
    Cookie: [`builder:token=${builderToken}`],
  }
}

exports.createModel = async (request, appId, instanceId, model) => {
  model = model || {
    name: "TestModel",
    type: "model",
    key: "name",
    schema: {
      name: {
        type: "text",
        constraints: {
          type: "string",
        },
      },
      description: {
        type: "text",
        constraints: {
          type: "string",
        },
      },
    },
  }

  const res = await request
    .post(`/api/models`)
    .set(exports.defaultHeaders(appId, instanceId))
    .send(model)
  return res.body
}

exports.createView = async (request, appId, instanceId, modelId, view) => {
  view = view || {
    map: "function(doc) { emit(doc[doc.key], doc._id); } ",
    modelId: modelId,
  }

  const res = await request
    .post(`/api/views`)
    .set(exports.defaultHeaders(appId, instanceId))
    .send(view)
  return res.body
}

exports.createClientDatabase = async id => await create(id || TEST_CLIENT_ID)

exports.createApplication = async (request, name = "test_application") => {
  const res = await request
    .post("/api/applications")
    .send({
      name,
    })
    .set(exports.defaultHeaders())
  return res.body
}

exports.destroyClientDatabase = async () => await destroy(TEST_CLIENT_ID)

exports.createInstance = async (request, appId) => {
  const res = await request
    .post(`/api/instances`)
    .send({
      name: "test-instance2",
    })
    .set(exports.defaultHeaders(appId))
  return res.body
}

exports.createUser = async (
  request,
  appId,
  instanceId,
  username = "babs",
  password = "babs_password"
) => {
  const res = await request
    .post(`/api/users`)
    .set(exports.defaultHeaders(appId, instanceId))
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
  appId,
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
    appId,
    instanceId,
    permissions,
    "onePermOnlyUser"
  )
}

const createUserWithAdminPermissions = async (request, appId, instanceId) => {
  let permissions = await generateAdminPermissions(instanceId)

  return await createUserWithPermissions(
    request,
    appId,
    instanceId,
    permissions,
    "adminUser"
  )
}

const createUserWithAllPermissionExceptOne = async (
  request,
  appId,
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
    appId,
    instanceId,
    permissions,
    "allPermsExceptOneUser"
  )
}

const createUserWithPermissions = async (
  request,
  appId,
  instanceId,
  permissions,
  username
) => {
  const accessRes = await request
    .post(`/api/accesslevels`)
    .send({ name: "TestLevel", permissions })
    .set(exports.defaultHeaders(appId, instanceId))

  const password = `password_${username}`
  await request
    .post(`/api/users`)
    .set(exports.defaultHeaders(appId, instanceId))
    .send({
      name: username,
      username,
      password,
      accessLevelId: accessRes.body._id,
    })

  const anonUser = {
    userId: "ANON",
    accessLevelId: ANON_LEVEL_ID,
    appId: appId,
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
  appId,
  instanceId,
  permissionName,
  itemId,
}) => {
  const headers = await createUserWithOnePermission(
    request,
    appId,
    instanceId,
    permissionName,
    itemId
  )

  await createRequest(request, method, url, body)
    .set(headers)
    .expect(200)

  const noPermsHeaders = await createUserWithAllPermissionExceptOne(
    request,
    appId,
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
  appId,
  instanceId,
}) => {
  const headers = await createUserWithAdminPermissions(request, appId, instanceId)

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
