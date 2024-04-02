const { Curl } = require("../../curl")
const fs = require("fs")
const path = require("path")

const getData = file => {
  return fs.readFileSync(path.join(__dirname, `./data/${file}.txt`), "utf8")
}

describe("Curl Import", () => {
  let curl

  beforeEach(() => {
    curl = new Curl()
  })

  it("validates unsupported data", async () => {
    let data
    let supported

    // JSON
    data = "{}"
    supported = await curl.isSupported(data)
    expect(supported).toBe(false)

    // Empty
    data = ""
    supported = await curl.isSupported(data)
    expect(supported).toBe(false)
  })

  const init = async file => {
    await curl.isSupported(getData(file))
  }

  it("returns import info", async () => {
    await init("get")
    const info = await curl.getInfo()
    expect(info.name).toBe("example.com")
  })

  describe("Returns queries", () => {
    const getQueries = async file => {
      await init(file)
      const queries = await curl.getQueries()
      expect(queries.length).toBe(1)
      return queries
    }

    const testVerb = async (file, verb) => {
      const queries = await getQueries(file)
      expect(queries[0].queryVerb).toBe(verb)
    }

    it("populates verb", async () => {
      await testVerb("get", "read")
      await testVerb("post", "create")
      await testVerb("put", "update")
      await testVerb("delete", "delete")
      await testVerb("patch", "patch")
    })

    const testPath = async (file, urlPath) => {
      const queries = await getQueries(file)
      expect(queries[0].fields.path).toBe(urlPath)
    }

    it("populates path", async () => {
      await testPath("get", "http://example.com/")
      await testPath("path", "http://example.com/paths/abc")
    })

    const testHeaders = async (file, headers) => {
      const queries = await getQueries(file)
      expect(queries[0].fields.headers).toStrictEqual(headers)
    }

    it("populates headers", async () => {
      await testHeaders("get", {})
      await testHeaders("headers", {
        "x-bb-header-1": "123",
        "x-bb-header-2": "456",
      })
    })

    const testQuery = async (file, queryString) => {
      const queries = await getQueries(file)
      expect(queries[0].fields.queryString).toBe(queryString)
    }
    it("populates query", async () => {
      await testQuery("get", "")
      await testQuery("query", "q1=v1&q1=v2")
    })

    const testBody = async (file, body) => {
      const queries = await getQueries(file)
      expect(queries[0].fields.requestBody).toStrictEqual(
        JSON.stringify(body, null, 2)
      )
    }

    it("populates body", async () => {
      await testBody("get", undefined)
      await testBody("post", { key: "val" })
      await testBody("empty-body", {})
    })
  })
})
