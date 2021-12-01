const { OpenAPI2 } = require("../../openapi2")
const fs = require("fs")
const path = require('path')

const getData = (file, extension) => {
  return fs.readFileSync(path.join(__dirname, `./data/${file}/${file}.${extension}`), "utf8")
}

describe("OpenAPI2 Import", () => {
  let openapi2 

  beforeEach(() => {
    openapi2 = new OpenAPI2()
  })

  it("validates unsupported data", async () => {
    let data
    let supported

    // non json / yaml
    data = "curl http://example.com"
    supported = await openapi2.isSupported(data)
    expect(supported).toBe(false)

    // Empty
    data = ""
    supported = await openapi2.isSupported(data)
    expect(supported).toBe(false)
  })

  const init = async (file, extension) => {
    await openapi2.isSupported(getData(file, extension))
  }

  const runTests = async (filename, test) => {
    for (let extension of ["json", "yaml"]) {
      await test(filename, extension)
    }
  }

  const testImportInfo = async (file, extension) => {
    await init(file, extension)
    const info = await openapi2.getInfo()
    expect(info.url).toBe("https://petstore.swagger.io/v2")
    expect(info.name).toBe("Swagger Petstore")
  }

  it("returns import info", async () => {
    await runTests("petstore", testImportInfo)
  })
  
  describe("Returns queries", () => {
    const getQueries = async (file) => {
      await init(file)
      const queries = await openapi2.getQueries()
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
        await testPath("get", "")
        await testPath("path", "paths/abc")
    })

    const testHeaders = async (file, headers) => {
      const queries = await getQueries(file)
      expect(queries[0].fields.headers).toStrictEqual(headers)
    }

    it("populates headers", async () => {
      await testHeaders("get", {})
      await testHeaders("headers", { "x-bb-header-1" : "123", "x-bb-header-2" : "456"} )
    })

    const testQuery = async (file, queryString) => {
      const queries = await getQueries(file)
      expect(queries[0].fields.queryString).toBe(queryString)
    }
    it("populates query", async () => {
      await testQuery("get", "")
      await testQuery("query", "q1=v1&q1=v2")
    })

    const testBody = async (file, queryString) => {
      const queries = await getQueries(file)
      expect(queries[0].fields.requestBody).toStrictEqual(queryString)
    }

    it("populates body", async () => {
      await testBody("get", undefined)
      await testBody("post", { "key" : "val" })
      await testBody("empty-body", {})
    })
  })
})