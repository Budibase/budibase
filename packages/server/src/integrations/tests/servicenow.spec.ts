import ServiceNowModule, { buildServiceNowBaseUrl } from "../servicenow"
import { fetch } from "undici"

jest.mock("undici", () => ({
  fetch: jest.fn(),
}))

const fetchMock = fetch as jest.MockedFunction<typeof fetch>
const buildIntegration = () =>
  new ServiceNowModule.integration({
    domain: "example",
    username: "user",
    password: "pass",
  })
const createFetchResponse = (data: unknown, status = 200, length?: string) =>
  ({
    ok: true,
    status,
    headers: {
      get: jest.fn(() => length),
    },
    json: jest.fn(() => Promise.resolve({ result: data })),
    text: jest.fn(() => Promise.resolve("")),
  }) as any

describe("ServiceNow integration config helpers", () => {
  describe("buildServiceNowBaseUrl", () => {
    it("builds a base URL from a plain domain", () => {
      expect(buildServiceNowBaseUrl("example")).toEqual(
        "https://example.service-now.com/api"
      )
    })

    it("strips protocols, suffixes, and paths", () => {
      expect(
        buildServiceNowBaseUrl("https://Example.service-now.com/custom/path")
      ).toEqual("https://example.service-now.com/api")
    })

    it("throws for invalid domains", () => {
      expect(() => buildServiceNowBaseUrl("bad domain")).toThrow(
        "ServiceNow domain may only contain letters, numbers, or hyphens"
      )
    })
  })
})

describe("ServiceNow integration CRUD helpers", () => {
  beforeEach(() => {
    fetchMock.mockReset()
  })

  it("creates an incident record", async () => {
    const integration = buildIntegration()
    const payload = { short_description: "testing" }
    fetchMock.mockResolvedValueOnce(createFetchResponse({ sys_id: "123" }))

    await expect(
      integration.create({
        extra: { endpoint: "incident.create" },
        payload,
      })
    ).resolves.toEqual({ sys_id: "123" })

    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.service-now.com/api/now/table/incident",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(payload),
      })
    )
  })

  it("reads an incident by sysId", async () => {
    const integration = buildIntegration()
    fetchMock.mockResolvedValueOnce(createFetchResponse({ sys_id: "abc" }))

    await expect(
      integration.read({
        extra: { endpoint: "incident.get" },
        sysId: "abc",
      })
    ).resolves.toEqual({ sys_id: "abc" })

    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.service-now.com/api/now/table/incident/abc",
      expect.objectContaining({
        method: "GET",
      })
    )
  })

  it("updates a user record", async () => {
    const integration = buildIntegration()
    const payload = { active: false }
    fetchMock.mockResolvedValueOnce(createFetchResponse({ success: true }))

    await expect(
      integration.update({
        extra: { endpoint: "user.update" },
        sysId: "user-1",
        payload,
      })
    ).resolves.toEqual({ success: true })

    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.service-now.com/api/now/table/sys_user/user-1",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify(payload),
      })
    )
  })

  it("deletes a table record", async () => {
    const integration = buildIntegration()
    fetchMock.mockResolvedValueOnce(createFetchResponse(undefined, 204, "0"))

    await expect(
      integration.delete({
        extra: { endpoint: "tableRecord.delete" },
        tableName: "u_table",
        sysId: "table-123",
      })
    ).resolves.toEqual({ success: true })

    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.service-now.com/api/now/table/u_table/table-123",
      expect.objectContaining({
        method: "DELETE",
      })
    )
  })
})
