import { ServiceApiKeyAccessLevel, ServiceApiKeyStatus } from "@budibase/types"
import { TestConfiguration } from "../../../../tests"

describe("/api/global/service-api-keys", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("creates, redacts, lists, and revokes a service API key", async () => {
    const createResponse = await config.request
      .post("/api/global/service-api-keys")
      .set(config.defaultHeaders())
      .send({
        name: "Data reader",
        accessLevel: ServiceApiKeyAccessLevel.READ_ONLY,
        workspaceAccess: { type: "all" },
        tenantAdmin: false,
      })
      .expect(201)

    expect(createResponse.body.apiKey).toMatch(/^bbsvc_/)
    expect(createResponse.body.serviceApiKey).toEqual(
      expect.objectContaining({
        name: "Data reader",
        status: ServiceApiKeyStatus.ACTIVE,
      })
    )
    expect(createResponse.body.serviceApiKey.secretHash).toBeUndefined()

    const listResponse = await config.request
      .get("/api/global/service-api-keys")
      .set(config.defaultHeaders())
      .expect(200)

    expect(listResponse.body.serviceApiKeys).toContainEqual(
      createResponse.body.serviceApiKey
    )
    expect(JSON.stringify(listResponse.body)).not.toContain(
      createResponse.body.apiKey
    )

    await config.request
      .post(
        `/api/global/service-api-keys/${createResponse.body.serviceApiKey._id}/revoke`
      )
      .set(config.defaultHeaders())
      .expect(204)

    await config.request
      .post(
        `/api/global/service-api-keys/${createResponse.body.serviceApiKey._id}/revoke`
      )
      .set(config.defaultHeaders())
      .expect(204)

    const revokedList = await config.request
      .get("/api/global/service-api-keys")
      .set(config.defaultHeaders())
      .expect(200)
    expect(revokedList.body.serviceApiKeys[0]).toEqual(
      expect.objectContaining({
        status: ServiceApiKeyStatus.REVOKED,
        revokedAt: expect.any(String),
      })
    )
  })

  it("rejects tenant administration with selected workspace access", async () => {
    await config.request
      .post("/api/global/service-api-keys")
      .set(config.defaultHeaders())
      .send({
        name: "Invalid key",
        accessLevel: ServiceApiKeyAccessLevel.READ_WRITE,
        workspaceAccess: { type: "selected", workspaceIds: ["app_unknown"] },
        tenantAdmin: true,
      })
      .expect(400)
  })

  it("requires an administrator", async () => {
    const user = await config.createUser({
      admin: { global: false },
      builder: { global: true },
    })
    await config.login(user)
    await config.withUser(user, async () => {
      await config.request
        .get("/api/global/service-api-keys")
        .set(config.defaultHeaders())
        .expect(403)
    })
  })
})
