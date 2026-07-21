jest.mock("../../../oauth2", () => {
  const actual = jest.requireActual("../../../oauth2")
  return {
    ...actual,
    getTokenFromConfig: jest.fn(),
    cleanStoredTokensForAuthConfig: jest.fn(),
  }
})

import {
  collectSharePointFilesRecursive,
  fetchSharePointListDocument,
  fetchSharePointSitesByDatasourceAuthConfig,
  isAllowedSharePointNextLink,
  listSharePointDrives,
  listSharePointLists,
} from "./connection"
import { type Datasource, OAuth2GrantType, RestAuthType } from "@budibase/types"
import sdk from "../../../.."

const getTokenFromConfigMock = jest.mocked(sdk.oauth2.getTokenFromConfig)
const cleanStoredTokensForAuthConfigMock = jest.mocked(
  sdk.oauth2.cleanStoredTokensForAuthConfig
)
const mockOAuthBearerToken = () =>
  getTokenFromConfigMock.mockResolvedValue("Bearer token")

describe("isAllowedSharePointNextLink", () => {
  it("accepts Graph v1.0 root and nested paths", () => {
    expect(
      isAllowedSharePointNextLink(
        "https://graph.microsoft.com/v1.0/sites?$top=200"
      )
    ).toBe(true)
    expect(
      isAllowedSharePointNextLink(
        "https://graph.microsoft.com/v1.0/drives/abc/items/def/children?$skiptoken=x"
      )
    ).toBe(true)
  })

  it("rejects non-https protocol", () => {
    expect(
      isAllowedSharePointNextLink("http://graph.microsoft.com/v1.0/sites")
    ).toBe(false)
  })

  it("rejects non-Graph hosts", () => {
    expect(isAllowedSharePointNextLink("https://example.com/v1.0/sites")).toBe(
      false
    )
    expect(
      isAllowedSharePointNextLink("https://graph.microsoft.com.evil.com/v1.0")
    ).toBe(false)
  })

  it("rejects paths outside Graph v1.0", () => {
    expect(
      isAllowedSharePointNextLink("https://graph.microsoft.com/beta/sites")
    ).toBe(false)
    expect(
      isAllowedSharePointNextLink("https://graph.microsoft.com/v1.0evil/sites")
    ).toBe(false)
  })

  it("rejects invalid URLs", () => {
    expect(isAllowedSharePointNextLink("not-a-url")).toBe(false)
  })
})

describe("SharePoint lists", () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("returns visible lists without document libraries", async () => {
    jest.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        value: [
          {
            id: "list-1",
            displayName: "FAQs",
            webUrl: "https://example.com/faqs",
            list: { hidden: false, template: "genericList" },
          },
          {
            id: "documents",
            displayName: "Documents",
            list: { hidden: false, template: "documentLibrary" },
          },
          {
            id: "hidden",
            displayName: "Hidden",
            list: { hidden: true, template: "genericList" },
          },
        ],
      }),
    } as Response)

    await expect(
      listSharePointLists("Bearer token", "site-1")
    ).resolves.toEqual([
      {
        id: "list-1",
        name: "FAQs",
        webUrl: "https://example.com/faqs",
      },
    ])
  })

  it("builds CSV from visible columns and list items", async () => {
    jest.spyOn(globalThis, "fetch").mockImplementation(async input => {
      const url = input.toString()
      if (url.includes("/columns")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            value: [
              { name: "Title", displayName: "Title", hidden: false },
              { name: "Details", displayName: "Details", hidden: false },
              { name: "Internal", displayName: "Internal", hidden: true },
            ],
          }),
        } as Response
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          value: [
            {
              id: "2",
              fields: { Title: "Second", Details: ["a", "b"] },
            },
            {
              id: "1",
              fields: { Title: "First", Details: { b: 2, a: 1 } },
            },
          ],
        }),
      } as Response
    })

    const document = await fetchSharePointListDocument(
      "Bearer token",
      "site-1",
      "list-1"
    )

    expect(document.itemCount).toBe(2)
    expect(document.buffer.toString()).toBe(
      [
        "SharePoint Item ID,Created,Modified,Web URL,Details,Title",
        '2,,,,"[""a"",""b""]",Second',
        '1,,,,"{""a"":1,""b"":2}",First',
      ].join("\n")
    )
  })

  it("neutralizes formula-like values in generated CSV cells", async () => {
    jest.spyOn(globalThis, "fetch").mockImplementation(async input => {
      const url = input.toString()
      if (url.includes("/columns")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            value: [
              { name: "Formula", displayName: "＝Formula", hidden: false },
              { name: "Safe", displayName: "Safe", hidden: false },
            ],
          }),
        } as Response
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          value: [
            {
              id: "1",
              fields: {
                Formula: '=HYPERLINK("https://example.com")',
                Safe: "plain text",
              },
            },
            {
              id: "2",
              fields: { Formula: "+SUM(1,1)", Safe: "plain text" },
            },
            {
              id: "3",
              fields: { Formula: "-1", Safe: "plain text" },
            },
            {
              id: "4",
              fields: { Formula: "@SUM(1)", Safe: "plain text" },
            },
            {
              id: "5",
              fields: { Formula: "\t=1", Safe: "plain text" },
            },
            {
              id: "6",
              fields: { Formula: "\r=1", Safe: "plain text" },
            },
            {
              id: "7",
              fields: { Formula: "\n=1", Safe: "plain text" },
            },
            {
              id: "8",
              fields: { Formula: "＝1+1", Safe: "plain text" },
            },
            {
              id: "9",
              fields: { Formula: "＋1+1", Safe: "plain text" },
            },
            {
              id: "10",
              fields: { Formula: "－1", Safe: "plain text" },
            },
            {
              id: "11",
              fields: { Formula: "＠SUM(1)", Safe: "plain text" },
            },
          ],
        }),
      } as Response
    })

    const document = await fetchSharePointListDocument(
      "Bearer token",
      "site-1",
      "list-1"
    )

    expect(document.buffer.toString()).toBe(
      [
        "SharePoint Item ID,Created,Modified,Web URL,'＝Formula,Safe",
        '1,,,,"\'=HYPERLINK(""https://example.com"")",plain text',
        '2,,,,"\'+SUM(1,1)",plain text',
        "3,,,,'-1,plain text",
        "4,,,,'@SUM(1),plain text",
        "5,,,,'\t=1,plain text",
        '6,,,,"\'\r=1",plain text',
        '7,,,,"\'\n=1",plain text',
        "8,,,,'＝1+1,plain text",
        "9,,,,'＋1+1,plain text",
        "10,,,,'－1,plain text",
        "11,,,,'＠SUM(1),plain text",
      ].join("\n")
    )
  })

  it("rejects generated list CSVs while paging when they exceed the size limit", async () => {
    const fetchMock = jest
      .spyOn(globalThis, "fetch")
      .mockImplementation(async input => {
        const url = input.toString()
        if (url.includes("/columns")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              value: [{ name: "Title", displayName: "Title", hidden: false }],
            }),
          } as Response
        }
        return {
          ok: true,
          status: 200,
          json: async () => ({
            value: [
              {
                id: "1",
                fields: { Title: "x".repeat(100) },
              },
            ],
            "@odata.nextLink": `${url}&skiptoken=next`,
          }),
        } as Response
      })

    await expect(
      fetchSharePointListDocument("Bearer token", "site-1", "list-1", 80)
    ).rejects.toThrow(
      "Generated SharePoint list CSV exceeds the 100 MB knowledge file limit"
    )

    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})

describe("fetchSharePointSitesByDatasourceAuthConfig (token-backed)", () => {
  const bearerToken = "Bearer token"
  const datasourceId = "datasource_1"
  const authConfigId = "auth_1"

  const mockDatasource = () => {
    const datasource = {
      _id: datasourceId,
      type: "datasource",
      source: "REST",
      config: {
        authConfigs: [
          {
            _id: authConfigId,
            type: RestAuthType.OAUTH2,
            url: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
            clientId: "client-id",
            clientSecret: "secret",
            grantType: OAuth2GrantType.CLIENT_CREDENTIALS,
            accessToken: "token",
            tokenType: "Bearer",
            expiresAt: Date.now() + 60_000,
          },
        ],
      },
    } as Datasource

    jest.spyOn(sdk.datasources, "get").mockResolvedValue(datasource)
  }

  afterEach(() => {
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    getTokenFromConfigMock.mockReset()
    cleanStoredTokensForAuthConfigMock.mockReset()
    mockOAuthBearerToken()
  })
  it("uses sites search query and maps displayName with webUrl", async () => {
    mockDatasource()
    const fetchMock = jest.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        value: [
          {
            id: "site-1",
            displayName: "Site One",
            name: "Ignored Name",
            webUrl: "https://contoso.sharepoint.com/sites/site-1",
          },
        ],
      }),
    } as Response)

    const sites = await fetchSharePointSitesByDatasourceAuthConfig(
      datasourceId,
      authConfigId
    )

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("https://graph.microsoft.com/v1.0/sites?"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: bearerToken,
        }),
      })
    )
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(sites).toEqual([
      {
        id: "site-1",
        name: "Site One",
        webUrl: "https://contoso.sharepoint.com/sites/site-1",
      },
    ])
  })

  it("paginates and deduplicates by site id", async () => {
    mockDatasource()
    const fetchMock = jest
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          value: [
            {
              id: "site-1",
              displayName: "Site One",
              webUrl: "https://contoso.sharepoint.com/sites/site-1",
            },
            {
              id: "site-2",
              displayName: "Site Two",
              webUrl: "https://contoso.sharepoint.com/sites/site-2",
            },
          ],
          "@odata.nextLink":
            "https://graph.microsoft.com/v1.0/sites?$skiptoken=abc",
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          value: [
            {
              id: "site-2",
              displayName: "Site Two Updated",
              webUrl: "https://contoso.sharepoint.com/sites/site-2",
            },
            {
              id: "site-3",
              displayName: "Site Three",
              webUrl: "https://contoso.sharepoint.com/sites/site-3",
            },
          ],
        }),
      } as Response)

    const sites = await fetchSharePointSitesByDatasourceAuthConfig(
      datasourceId,
      authConfigId
    )

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining(
        "https://graph.microsoft.com/v1.0/sites?search=*&$top=200&$select=id,displayName,name,webUrl"
      ),
      expect.any(Object)
    )
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining(
        "https://graph.microsoft.com/v1.0/sites?$skiptoken=abc"
      ),
      expect.any(Object)
    )
    expect(sites).toEqual([
      {
        id: "site-1",
        name: "Site One",
        webUrl: "https://contoso.sharepoint.com/sites/site-1",
      },
      {
        id: "site-3",
        name: "Site Three",
        webUrl: "https://contoso.sharepoint.com/sites/site-3",
      },
      {
        id: "site-2",
        name: "Site Two Updated",
        webUrl: "https://contoso.sharepoint.com/sites/site-2",
      },
    ])
  })

  it("throws access denied error for 403", async () => {
    mockDatasource()
    jest.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => ({}),
    } as Response)

    await expect(
      fetchSharePointSitesByDatasourceAuthConfig(datasourceId, authConfigId)
    ).rejects.toEqual(
      expect.objectContaining({
        message:
          "Access denied by Microsoft Graph. Ensure SharePoint application permissions are granted.",
        status: 400,
      })
    )
  })

  it("retries with refreshed token once for 401 and then fails", async () => {
    mockDatasource()
    const fetchMock = jest.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({}),
    } as Response)

    await expect(
      fetchSharePointSitesByDatasourceAuthConfig(datasourceId, authConfigId)
    ).rejects.toEqual(
      expect.objectContaining({
        message:
          "Authentication failed with Microsoft Graph. Verify SharePoint application credentials and try again.",
        status: 400,
      })
    )
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(getTokenFromConfigMock).toHaveBeenCalledTimes(2)
    expect(cleanStoredTokensForAuthConfigMock).toHaveBeenCalledTimes(1)
    expect(cleanStoredTokensForAuthConfigMock).toHaveBeenCalledWith(
      authConfigId,
      datasourceId
    )
  })

  it("retries once after 401 and succeeds with refreshed token", async () => {
    mockDatasource()
    const fetchMock = jest
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({}),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          value: [
            {
              id: "site-1",
              displayName: "Site One",
              webUrl: "https://contoso.sharepoint.com/sites/site-1",
            },
          ],
        }),
      } as Response)

    const sites = await fetchSharePointSitesByDatasourceAuthConfig(
      datasourceId,
      authConfigId
    )

    expect(sites).toEqual([
      {
        id: "site-1",
        name: "Site One",
        webUrl: "https://contoso.sharepoint.com/sites/site-1",
      },
    ])
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(getTokenFromConfigMock).toHaveBeenCalledTimes(2)
    expect(cleanStoredTokensForAuthConfigMock).toHaveBeenCalledTimes(1)
    expect(cleanStoredTokensForAuthConfigMock).toHaveBeenCalledWith(
      authConfigId,
      datasourceId
    )
  })
})

describe("fetchSharePointSitesByDatasourceAuthConfig", () => {
  const datasourceId = "datasource_1"
  const authConfigId = "auth_1"

  const mockDatasource = () => {
    const datasource = {
      _id: datasourceId,
      type: "datasource",
      source: "REST",
      config: {
        authConfigs: [
          {
            _id: authConfigId,
            type: RestAuthType.OAUTH2,
            url: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
            clientId: "client-id",
            clientSecret: "secret",
            grantType: OAuth2GrantType.CLIENT_CREDENTIALS,
            accessToken: "token",
            tokenType: "Bearer",
            expiresAt: Date.now() + 60_000,
          },
        ],
      },
    } as Datasource

    jest.spyOn(sdk.datasources, "get").mockResolvedValue(datasource)
  }

  afterEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  beforeEach(() => {
    getTokenFromConfigMock.mockReset()
    cleanStoredTokensForAuthConfigMock.mockReset()
    mockOAuthBearerToken()
  })

  it("uses app-permission guidance for client credentials 403", async () => {
    mockDatasource()
    jest.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => ({}),
    } as Response)

    await expect(
      fetchSharePointSitesByDatasourceAuthConfig(datasourceId, authConfigId)
    ).rejects.toEqual(
      expect.objectContaining({
        message:
          "Access denied by Microsoft Graph. Ensure SharePoint application permissions are granted.",
      })
    )
  })

  it("clears cached token on 401, retries once, and surfaces auth guidance", async () => {
    mockDatasource()
    const fetchMock = jest.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({}),
    } as Response)

    await expect(
      fetchSharePointSitesByDatasourceAuthConfig(datasourceId, authConfigId)
    ).rejects.toEqual(
      expect.objectContaining({
        message:
          "Authentication failed with Microsoft Graph. Verify SharePoint application credentials and try again.",
        status: 400,
      })
    )

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(getTokenFromConfigMock).toHaveBeenCalledTimes(2)
    expect(cleanStoredTokensForAuthConfigMock).toHaveBeenCalledTimes(1)
    expect(cleanStoredTokensForAuthConfigMock).toHaveBeenCalledWith(
      authConfigId,
      datasourceId
    )
  })
})

describe("SharePoint Graph retries", () => {
  const bearerToken = "Bearer token"
  const datasourceId = "datasource_1"
  const authConfigId = "auth_1"

  const mockDatasource = () => {
    jest.spyOn(sdk.datasources, "get").mockResolvedValue({
      _id: datasourceId,
      type: "datasource",
      source: "REST",
      config: {
        authConfigs: [
          {
            _id: authConfigId,
            type: RestAuthType.OAUTH2,
            url: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
            clientId: "client-id",
            clientSecret: "secret",
            grantType: OAuth2GrantType.CLIENT_CREDENTIALS,
            accessToken: "token",
            tokenType: "Bearer",
            expiresAt: Date.now() + 60_000,
          },
        ],
      },
    } as Datasource)
  }

  afterEach(() => {
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    mockOAuthBearerToken()
  })

  it("retries site search on 429 then succeeds", async () => {
    mockDatasource()
    const fetchMock = jest
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        headers: { get: () => null },
        json: async () => ({}),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => ({
          value: [
            {
              id: "site-1",
              displayName: "Site One",
              webUrl: "https://contoso.sharepoint.com/sites/site-1",
            },
          ],
        }),
      } as unknown as Response)

    const sites = await fetchSharePointSitesByDatasourceAuthConfig(
      datasourceId,
      authConfigId
    )

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(sites).toEqual([
      {
        id: "site-1",
        name: "Site One",
        webUrl: "https://contoso.sharepoint.com/sites/site-1",
      },
    ])
  })

  it("uses Retry-After for site search delays", async () => {
    mockDatasource()
    const logSpy = jest.spyOn(console, "log").mockImplementation()
    jest
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        headers: {
          get: (name: string) => (name === "Retry-After" ? "2" : null),
        },
        json: async () => ({}),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => ({
          value: [],
        }),
      } as unknown as Response)

    await fetchSharePointSitesByDatasourceAuthConfig(datasourceId, authConfigId)

    expect(logSpy).toHaveBeenCalledWith(
      "Retrying SharePoint Graph request after failure",
      expect.objectContaining({
        operation: "fetchSharePointSites",
        status: 429,
        delayMs: 2000,
      })
    )
  })

  it("retries listSharePointDrives on 429 then succeeds", async () => {
    const fetchMock = jest
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        headers: { get: () => null },
        json: async () => ({}),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => ({
          value: [{ id: "drive-1", name: "Documents" }, { name: "Missing ID" }],
        }),
      } as unknown as Response)

    const drives = await listSharePointDrives(bearerToken, "site-1")

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(drives).toEqual([{ id: "drive-1", name: "Documents" }])
  })

  it("does not retry listSharePointDrives on 403", async () => {
    const fetchMock = jest.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 403,
      headers: { get: () => null },
      json: async () => ({}),
    } as unknown as Response)

    await expect(listSharePointDrives(bearerToken, "site-1")).rejects.toEqual(
      expect.objectContaining({
        message:
          "Access denied by Microsoft Graph. Ensure delegated SharePoint read permissions are granted.",
        status: 400,
      })
    )
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it("retries paginated drive items requests and continues", async () => {
    const fetchMock = jest
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
        headers: { get: () => null },
        json: async () => ({}),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => ({
          value: [
            {
              id: "item-1",
              name: "doc-1.txt",
              file: { mimeType: "text/plain" },
            },
          ],
          "@odata.nextLink":
            "https://graph.microsoft.com/v1.0/drives/drive-1/root/children?$skiptoken=abc",
        }),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => ({
          value: [
            {
              id: "item-2",
              name: "doc-2.txt",
              file: { mimeType: "text/plain" },
            },
          ],
        }),
      } as unknown as Response)

    const files = await collectSharePointFilesRecursive(bearerToken, "drive-1")

    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(files.map(file => file.path)).toEqual(["doc-1.txt", "doc-2.txt"])
  })

  it("aborts an in-flight recursive listing without retrying", async () => {
    const controller = new AbortController()
    const timeoutError = new Error("SharePoint sync timed out")
    const fetchMock = jest
      .spyOn(globalThis, "fetch")
      .mockImplementation(async (_input, init) => {
        await new Promise<void>((_resolve, reject) => {
          init?.signal?.addEventListener(
            "abort",
            () => reject(init.signal?.reason),
            { once: true }
          )
        })
        throw new Error("unreachable")
      })

    const result = collectSharePointFilesRecursive(
      bearerToken,
      "drive-1",
      undefined,
      "",
      controller.signal
    )
    controller.abort(timeoutError)

    await expect(result).rejects.toBe(timeoutError)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})

describe("fetchSharePointSitesByDatasourceAuthConfig app token pagination", () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    mockOAuthBearerToken()
  })

  it("caps app-token pagination when nextLink keeps chaining", async () => {
    jest.spyOn(sdk.datasources, "get").mockResolvedValue({
      _id: "datasource_1",
      type: "datasource",
      source: "REST",
      config: {
        authConfigs: [
          {
            _id: "auth_1",
            type: RestAuthType.OAUTH2,
            url: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
            clientId: "client-id",
            clientSecret: "secret",
            grantType: OAuth2GrantType.CLIENT_CREDENTIALS,
            accessToken: "token",
            tokenType: "Bearer",
            expiresAt: Date.now() + 60_000,
          },
        ],
      },
    } as Datasource)

    const fetchMock = jest.spyOn(globalThis, "fetch").mockImplementation(
      async () =>
        ({
          ok: true,
          status: 200,
          json: async () => ({
            value: [],
            "@odata.nextLink":
              "https://graph.microsoft.com/v1.0/sites?$skiptoken=abc",
          }),
        }) as Response
    )

    const sites = await fetchSharePointSitesByDatasourceAuthConfig(
      "datasource_1",
      "auth_1"
    )

    expect(fetchMock).toHaveBeenCalledTimes(50)
    expect(sites).toEqual([])
  })
})
