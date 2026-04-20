import {
  fetchSharePointSitesByBearerToken,
  isAllowedSharePointNextLink,
} from "./connection"

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

describe("fetchSharePointSitesByBearerToken", () => {
  const bearerToken = "Bearer token"

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("uses Graph search query and maps displayName with webUrl", async () => {
    const fetchMock = jest.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        value: [
          {
            hitsContainers: [
              {
                moreResultsAvailable: false,
                hits: [
                  {
                    resource: {
                      id: "site-1",
                      displayName: "Site One",
                      name: "Ignored Name",
                      webUrl: "https://contoso.sharepoint.com/sites/site-1",
                    },
                  },
                ],
              },
            ],
          },
        ],
      }),
    } as Response)

    const sites = await fetchSharePointSitesByBearerToken(bearerToken)

    expect(fetchMock).toHaveBeenCalledWith(
      "https://graph.microsoft.com/v1.0/search/query",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: bearerToken,
          "Content-Type": "application/json",
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
    const fetchMock = jest
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          value: [
            {
              hitsContainers: [
                {
                  moreResultsAvailable: true,
                  hits: [
                    {
                      resource: {
                        id: "site-1",
                        displayName: "Site One",
                        webUrl: "https://contoso.sharepoint.com/sites/site-1",
                      },
                    },
                    {
                      resource: {
                        id: "site-2",
                        displayName: "Site Two",
                        webUrl: "https://contoso.sharepoint.com/sites/site-2",
                      },
                    },
                  ],
                },
              ],
            },
          ],
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          value: [
            {
              hitsContainers: [
                {
                  moreResultsAvailable: false,
                  hits: [
                    {
                      resource: {
                        id: "site-2",
                        displayName: "Site Two Updated",
                        webUrl: "https://contoso.sharepoint.com/sites/site-2",
                      },
                    },
                    {
                      resource: {
                        id: "site-3",
                        displayName: "Site Three",
                        webUrl: "https://contoso.sharepoint.com/sites/site-3",
                      },
                    },
                  ],
                },
              ],
            },
          ],
        }),
      } as Response)

    const sites = await fetchSharePointSitesByBearerToken(bearerToken)

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://graph.microsoft.com/v1.0/search/query",
      expect.objectContaining({
        body: JSON.stringify({
          requests: [
            {
              entityTypes: ["site"],
              query: { queryString: "*" },
              fields: ["id", "displayName", "name", "webUrl"],
              from: 0,
              size: 25,
            },
          ],
        }),
      })
    )
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://graph.microsoft.com/v1.0/search/query",
      expect.objectContaining({
        body: JSON.stringify({
          requests: [
            {
              entityTypes: ["site"],
              query: { queryString: "*" },
              fields: ["id", "displayName", "name", "webUrl"],
              from: 25,
              size: 25,
            },
          ],
        }),
      })
    )
    expect(sites).toEqual([
      {
        id: "site-1",
        name: "Site One",
        webUrl: "https://contoso.sharepoint.com/sites/site-1",
      },
      {
        id: "site-2",
        name: "Site Two Updated",
        webUrl: "https://contoso.sharepoint.com/sites/site-2",
      },
      {
        id: "site-3",
        name: "Site Three",
        webUrl: "https://contoso.sharepoint.com/sites/site-3",
      },
    ])
  })

  it("throws access denied error for 403", async () => {
    jest.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => ({}),
    } as Response)

    await expect(
      fetchSharePointSitesByBearerToken(bearerToken)
    ).rejects.toEqual(
      expect.objectContaining({
        message:
          "Access denied by Microsoft Graph. Ensure delegated SharePoint read permissions are granted.",
        status: 400,
      })
    )
  })
})
