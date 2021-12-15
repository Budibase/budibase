jest.mock("node-fetch", () =>
  jest.fn(() => ({
    headers: {
      raw: () => {
        return { "content-type": ["application/json"] }
      },
      get: () => ["application/json"]
    },
    json: jest.fn(), 
    text: jest.fn()
  }))
)
const fetch = require("node-fetch")
const RestIntegration = require("../rest")
const { AuthType } = require("../rest")

class TestConfiguration {
  constructor(config = {}) {
    this.integration = new RestIntegration.integration(config)
  }
}

describe("REST Integration", () => {
  const BASE_URL = "https://myapi.com"
  let config

  beforeEach(() => {
    config = new TestConfiguration({
      url: BASE_URL,
    })
    jest.clearAllMocks()
  })

  it("calls the create method with the correct params", async () => {
    const query = {
      path: "api",
      queryString: "test=1",
      headers: {
        Accept: "application/json",
      },
      bodyType: "json",
      requestBody: JSON.stringify({
        name: "test",
      }),
    }
    const response = await config.integration.create(query)
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api?test=1`, {
      method: "POST",
      body: '{"name":"test"}',
      headers: {
        Accept: "application/json",
      },
    })
  })

  it("calls the read method with the correct params", async () => {
    const query = {
      path: "api",
      queryString: "test=1",
      headers: {
        Accept: "text/html",
      },
    }
    const response = await config.integration.read(query)
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api?test=1`, {
      headers: {
        Accept: "text/html",
      },
      method: "GET",
    })
  })

  it("calls the update method with the correct params", async () => {
    const query = {
      path: "api",
      queryString: "test=1",
      headers: {
        Accept: "application/json",
      },
      bodyType: "json",
      requestBody: JSON.stringify({
        name: "test",
      }),
    }
    const response = await config.integration.update(query)
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api?test=1`, {
      method: "PUT",
      body: '{"name":"test"}',
      headers: {
        Accept: "application/json",
      },
    })
  })

  it("calls the delete method with the correct params", async () => {
    const query = {
      path: "api",
      queryString: "test=1",
      headers: {
        Accept: "application/json",
      },
      bodyType: "json",
      requestBody: JSON.stringify({
        name: "test",
      }),
    }
    const response = await config.integration.delete(query)
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api?test=1`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
      body: '{"name":"test"}',
    })
  })

  describe("authentication", () => {
    const basicAuth = {
      _id: "c59c14bd1898a43baa08da68959b24686",
      name: "basic-1",
      type : AuthType.BASIC,
      config : {
        username: "user",
        password: "password"
      }
    }
    
    const bearerAuth = {
      _id: "0d91d732f34e4befabeff50b392a8ff3",
      name: "bearer-1",
      type : AuthType.BEARER,
      config : {
        "token": "mytoken"
      }
    }

    beforeEach(() => {
      config = new TestConfiguration({
        url: BASE_URL,
        authConfigs : [basicAuth, bearerAuth]
      })
    })

    it("adds basic auth", async () => {
      const query = {
        authConfigId: "c59c14bd1898a43baa08da68959b24686"
      }
      await config.integration.read(query)
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/?`, {
        method: "GET",
        headers: {
          Authorization: "Basic dXNlcjpwYXNzd29yZA=="
        },
      })
    })

    it("adds bearer auth", async () => {
      const query = {
        authConfigId: "0d91d732f34e4befabeff50b392a8ff3"
      }
      await config.integration.read(query)
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/?`, {
        method: "GET",
        headers: {
          Authorization: "Bearer mytoken"
        },
      })
    })
  })
})
