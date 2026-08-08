import { roles, serviceApiKeys } from "@budibase/backend-core"
import { ServiceApiKeyAccessLevel, Table, User } from "@budibase/types"
import { basicTable } from "../../../../tests/utilities/structures"
import * as setup from "../../tests/utilities"
import { PublicAPIRequest } from "./Request"
import { generateMakeRequest, MakeRequestResponse } from "./utils"

describe("check public API security", () => {
  const config = setup.getConfig()
  let builderRequest: PublicAPIRequest,
    appUserRequest: PublicAPIRequest,
    table: Table,
    appUser: User,
    workspaceId: string,
    readOnlyRequest: MakeRequestResponse,
    readWriteRequest: MakeRequestResponse,
    tenantAdminRequest: MakeRequestResponse,
    readOnlyServiceApiKeyId: string,
    readWriteServiceApiKey: string

  beforeAll(async () => {
    await config.init()
    const builderUser = await config.globalUser()
    appUser = await config.globalUser({
      builder: { global: false },
      roles: {
        [config.getProdWorkspaceId()]: roles.BUILTIN_ROLE_IDS.BASIC,
      },
    })
    builderRequest = await PublicAPIRequest.init(config, builderUser)
    appUserRequest = await PublicAPIRequest.init(config, appUser)
    table = (await builderRequest.tables.create(basicTable())).data
    workspaceId = config.getDevWorkspaceId()
    const readOnly = await config.doInTenant(() =>
      serviceApiKeys.create({
        name: "Read only",
        accessLevel: ServiceApiKeyAccessLevel.READ_ONLY,
        workspaceAccess: {
          type: "selected",
          workspaceIds: [config.getProdWorkspaceId()],
        },
        tenantAdmin: false,
        createdBy: builderUser._id!,
      })
    )
    const readWrite = await config.doInTenant(() =>
      serviceApiKeys.create({
        name: "Read write",
        accessLevel: ServiceApiKeyAccessLevel.READ_WRITE,
        workspaceAccess: { type: "all" },
        tenantAdmin: false,
        createdBy: builderUser._id!,
      })
    )
    const tenantAdmin = await config.doInTenant(() =>
      serviceApiKeys.create({
        name: "Tenant admin",
        accessLevel: ServiceApiKeyAccessLevel.READ_ONLY,
        workspaceAccess: { type: "all" },
        tenantAdmin: true,
        createdBy: builderUser._id!,
      })
    )
    readOnlyServiceApiKeyId = readOnly.serviceApiKey._id!
    readWriteServiceApiKey = readWrite.apiKey
    readOnlyRequest = generateMakeRequest(readOnly.apiKey)
    readWriteRequest = generateMakeRequest(readWrite.apiKey)
    tenantAdminRequest = generateMakeRequest(tenantAdmin.apiKey)
  })

  it("should allow with builder API key", async () => {
    const res = await builderRequest.rows.search(
      table._id!,
      {},
      {
        status: 200,
      }
    )
    expect(res.data.length).toEqual(0)
  })

  it("should 403 when from browser, but API key", async () => {
    await appUserRequest.rows.search(
      table._id!,
      {},
      {
        status: 403,
      }
    )
  })

  it("should re-direct when using cookie", async () => {
    const headers = await config.login({
      userId: appUser._id!,
      builder: false,
      prodApp: false,
    })
    await config.withHeaders(
      {
        ...headers,
        "User-Agent": config.browserUserAgent(),
      },
      async () => {
        await config.api.row.search(
          table._id!,
          { query: {} },
          {
            status: 302,
          }
        )
      }
    )
  })

  it("allows read operations with a read-only service API key", async () => {
    const response = await readOnlyRequest(
      "post",
      `/tables/${table._id}/rows/search`,
      {},
      workspaceId
    )
    expect(response.status).toBe(200)
  })

  it("rejects write operations with a read-only service API key", async () => {
    const response = await readOnlyRequest(
      "post",
      `/tables/${table._id}/rows`,
      { name: "blocked" },
      workspaceId
    )
    expect(response.status).toBe(403)
    expect(response.body.message).toBe(
      "Service API key does not have write access"
    )
  })

  it("allows write operations with a read-write service API key", async () => {
    const response = await readWriteRequest(
      "post",
      `/tables/${table._id}/rows`,
      { name: "allowed" },
      workspaceId
    )
    expect(response.status).toBe(200)
  })

  it("rejects workspaces outside a selected scope", async () => {
    const response = await readOnlyRequest(
      "post",
      `/tables/${table._id}/rows/search`,
      {},
      "app_other"
    )
    expect(response.status).toBe(403)
    expect(response.body.message).toBe(
      "Service API key does not have access to this workspace"
    )
  })

  it("requires tenant administration for tenant-level endpoints", async () => {
    const denied = await readWriteRequest(
      "get",
      "/metrics",
      undefined,
      workspaceId
    )
    expect(denied.status).toBe(403)

    const allowed = await tenantAdminRequest(
      "get",
      "/metrics",
      undefined,
      workspaceId
    )
    expect(allowed.status).toBe(200)
  })

  it("treats workspace searches as tenant-level even with a workspace header", async () => {
    const denied = await readWriteRequest(
      "post",
      "/workspaces/search",
      undefined,
      workspaceId
    )
    expect(denied.status).toBe(403)

    const allowed = await tenantAdminRequest(
      "post",
      "/workspaces/search",
      undefined,
      workspaceId
    )
    expect(allowed.status).toBe(200)
  })

  it("rejects service API keys outside the public API", async () => {
    const internalRequest = generateMakeRequest(readWriteServiceApiKey, {
      internal: true,
    })
    const response = await internalRequest(
      "get",
      "/api/self",
      undefined,
      workspaceId
    )
    expect(response.status).toBe(403)
  })

  it("rejects a revoked service API key", async () => {
    await config.doInTenant(() =>
      serviceApiKeys.revoke({
        id: readOnlyServiceApiKeyId,
        revokedBy: config.getUser()._id!,
      })
    )
    const response = await readOnlyRequest(
      "post",
      `/tables/${table._id}/rows/search`,
      {},
      workspaceId
    )
    expect(response.status).toBe(403)
  })
})
