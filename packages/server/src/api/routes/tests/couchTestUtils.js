const CouchDB = require("../../../db")
const supertest = require("supertest")
const {
  BUILTIN_LEVEL_IDS,
} = require("../../../utilities/security/accessLevels")
const {
  BUILTIN_PERMISSION_NAMES,
} = require("../../../utilities/security/permissions")
const packageJson = require("../../../../package")
const jwt = require("jsonwebtoken")
const env = require("../../../environment")

const TEST_CLIENT_ID = "test-client-id"

exports.TEST_CLIENT_ID = TEST_CLIENT_ID
exports.supertest = async () => {
  let request
  let server
  env.PORT = 4002
  server = require("../../../app")

  request = supertest(server)
  return { request, server }
}

exports.defaultHeaders = appId => {
  const builderUser = {
    userId: "BUILDER",
    accessLevelId: BUILTIN_LEVEL_IDS.BUILDER,
  }

  const builderToken = jwt.sign(builderUser, env.JWT_SECRET)

  const headers = {
    Accept: "application/json",
    Cookie: [`budibase:builder:local=${builderToken}`],
  }
  if (appId) {
    headers["x-budibase-app-id"] = appId
  }

  return headers
}

exports.createTable = async (request, appId, table) => {
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
    .set(exports.defaultHeaders(appId))
    .send(table)
  return res.body
}

exports.getAllFromTable = async (request, appId, tableId) => {
  const res = await request
    .get(`/api/${tableId}/rows`)
    .set(exports.defaultHeaders(appId))
  return res.body
}

exports.createView = async (request, appId, tableId, view) => {
  view = view || {
    map: "function(doc) { emit(doc[doc.key], doc._id); } ",
    tableId: tableId,
  }

  const res = await request
    .post(`/api/views`)
    .set(exports.defaultHeaders(appId))
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
    await request
      .delete(`/api/applications/${appId}`)
      .set(exports.defaultHeaders(appId))
  }
}

exports.createUser = async (
  request,
  appId,
  email = "babs@babs.com",
  password = "babs_password"
) => {
  const res = await request
    .post(`/api/users`)
    .set(exports.defaultHeaders(appId))
    .send({
      name: "Bill",
      email,
      password,
      accessLevelId: BUILTIN_LEVEL_IDS.POWER,
    })
  return res.body
}

const createUserWithOnePermission = async (request, appId, permName) => {
  let permissions = [permName]

  return await createUserWithPermissions(
    request,
    appId,
    permissions,
    "onePermOnlyUser"
  )
}

const createUserWithAdminPermissions = async (request, appId) => {
  let permissions = [BUILTIN_PERMISSION_NAMES.ADMIN]

  return await createUserWithPermissions(
    request,
    appId,
    permissions,
    "adminUser"
  )
}

const createUserWithAllPermissionExceptOne = async (
  request,
  appId,
  permName
) => {
  let permissions = [permName]

  return await createUserWithPermissions(
    request,
    appId,
    permissions,
    "allPermsExceptOneUser"
  )
}

const createUserWithPermissions = async (
  request,
  appId,
  permissions,
  email
) => {
  const password = `password_${email}`
  await request
    .post(`/api/users`)
    .set(exports.defaultHeaders(appId))
    .send({
      email,
      password,
      accessLevelId: BUILTIN_LEVEL_IDS.POWER,
      permissions,
    })

  const anonUser = {
    userId: "ANON",
    accessLevelId: BUILTIN_LEVEL_IDS.PUBLIC,
    appId: appId,
    version: packageJson.version,
  }

  const anonToken = jwt.sign(anonUser, env.JWT_SECRET)

  const loginResult = await request
    .post(`/api/authenticate`)
    .set({
      Cookie: `budibase:${appId}:local=${anonToken}`,
      "x-budibase-app-id": appId,
    })
    .send({ email, password })

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
  permName1,
  permName2,
}) => {
  const headers = await createUserWithOnePermission(request, appId, permName1)

  await createRequest(request, method, url, body)
    .set(headers)
    .expect(200)

  const noPermsHeaders = await createUserWithAllPermissionExceptOne(
    request,
    appId,
    permName2
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
}) => {
  const headers = await createUserWithAdminPermissions(request, appId)

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
