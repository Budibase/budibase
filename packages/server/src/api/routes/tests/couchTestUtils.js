const CouchDB = require("../../../db")
const { create, destroy } = require("../../../db/clientDb")
const supertest = require("supertest")
const app = require("../../../app")
const {
  POWERUSER_LEVEL_ID,
  generateAdminPermissions,
} = require("../../../utilities/accessLevels")

const TEST_CLIENT_ID = "test-client-id"

exports.supertest = async () => {
  let request
  let port = 4002
  let server
  server = await app(port)

  request = supertest(server)
  return { request, server }
}

exports.defaultHeaders = {
  Accept: "application/json",
  Cookie: ["builder:token=test-admin-secret"],
}

exports.createModel = async (request, instanceId, model) => {
  model = model || {
    name: "TestModel",
    type: "model",
    key: "name",
    schema: {
      name: { type: "string" },
    },
  }

  const res = await request
    .post(`/api/${instanceId}/models`)
    .set(exports.defaultHeaders)
    .send(model)
  return res.body
}

exports.createRecord = async (request, instanceId, modelId, record) => {
  record = record || {
    modelId,
    name: "test name",
  }

  const res = await request
    .post(`/api/${instanceId}/${modelId}/records`)
    .send(record)
    .set(exports.defaultHeaders)
  return res.body
}

exports.createView = async (request, instanceId, view) => {
  view = view || {
    map: "function(doc) { emit(doc[doc.key], doc._id); } ",
  }

  const res = await request
    .post(`/api/${instanceId}/views`)
    .set(exports.defaultHeaders)
    .send(view)
  return res.body
}

exports.createClientDatabase = async () => await create(TEST_CLIENT_ID)

exports.createApplication = async (request, name = "test_application") => {
  const res = await request
    .post("/api/applications")
    .set(exports.defaultHeaders)
    .send({
      name,
    })
  return res.body
}

exports.destroyClientDatabase = async () => await destroy(TEST_CLIENT_ID)

exports.createInstance = async (request, appId) => {
  const res = await request
    .post(`/api/${appId}/instances`)
    .set(exports.defaultHeaders)
    .send({
      name: "test-instance",
    })
  return res.body
}

exports.createUser = async (
  request,
  instanceId,
  username = "babs",
  password = "babs_password"
) => {
  const res = await request
    .post(`/api/${instanceId}/users`)
    .set(exports.defaultHeaders)
    .send({
      name: "Bill",
      username,
      password,
      accessLevelId: POWERUSER_LEVEL_ID,
    })
  return res.body
}

const createUser_WithOnePermission = async (
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

const createUser_WithAdminPermissions = async (request, instanceId) => {
  let permissions = await generateAdminPermissions(instanceId)

  return await createUserWithPermissions(
    request,
    instanceId,
    permissions,
    "adminUser"
  )
}

const createUser_WithAllPermissionExceptOne = async (
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
    .post(`/api/${instanceId}/accesslevels`)
    .send({ name: "TestLevel", permissions })
    .set(exports.defaultHeaders)

  const password = `password_${username}`
  await request
    .post(`/api/${instanceId}/users`)
    .set(exports.defaultHeaders)
    .send({
      name: username,
      username,
      password,
      accessLevelId: accessRes.body._id,
    })

  const db = new CouchDB(instanceId)
  const designDoc = await db.get("_design/database")

  const loginResult = await request
    .post(`/api/authenticate`)
    .set("Referer", `http://localhost:4001/${designDoc.metadata.applicationId}`)
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
  const headers = await createUser_WithOnePermission(
    request,
    instanceId,
    permissionName,
    itemId
  )

  await createRequest(request, method, url, body)
    .set(headers)
    .expect(200)

  const noPermsHeaders = await createUser_WithAllPermissionExceptOne(
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
  const headers = await createUser_WithAdminPermissions(request, instanceId)

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
