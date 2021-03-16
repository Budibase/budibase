const fetch = require("node-fetch")
const RestIntegration = require("../rest")
jest.mock("node-fetch", () => jest.fn(() => ({ json: jest.fn() })))

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
      url: BASE_URL
    })
  })

  it("calls the create method with the correct params", async () => {
    const query = {
      path: "/api",
      queryString: "?test=1",
      headers: {
        Accept: "application/json"
      },
      json: {
        name: "test"
      }
    }
    const response = await config.integration.create(query)
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api?test=1`, {
      method: "POST",
      body: "{\"name\":\"test\"}",
      headers: {
        Accept: "application/json"
      }
    })
  })

  it("calls the read method with the correct params", async () => {
    const query = {
      path: "/api",
      queryString: "?test=1",
      headers: {
        Accept: "application/json"
      }
    }
    const response = await config.integration.read(query)
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api?test=1`, {
      headers: {
        Accept: "application/json"
      }
    })
  })

  it("calls the update method with the correct params", async () => {
    const query = {
      path: "/api",
      queryString: "?test=1",
      headers: {
        Accept: "application/json"
      },
      json: {
        name: "test"
      }
    }
    const response = await config.integration.update(query)
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api?test=1`, {
      method: "POST",
      body: "{\"name\":\"test\"}",
      headers: {
        Accept: "application/json"
      }
    })
  })

  it("calls the delete method with the correct params", async () => {
    const query = {
      path: "/api",
      queryString: "?test=1",
      headers: {
        Accept: "application/json"
      },
      json: {
        name: "test"
      }
    }
    const response = await config.integration.delete(query)
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api?test=1`, {
      method: "DELETE",
      headers: {
        Accept: "application/json"
      }
    })
  })
})