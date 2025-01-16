import { Curl } from "../../curl"
import { readFileSync } from "fs"
import { join } from "path"

const getData = (file: string) => {
  return readFileSync(join(__dirname, `./data/${file}.txt`), "utf8")
}

describe("Curl Import", () => {
  let curl: Curl

  beforeEach(() => {
    curl = new Curl()
  })

  it("validates unsupported data", async () => {
    expect(await curl.isSupported("{}")).toBe(false)
    expect(await curl.isSupported("")).toBe(false)
  })

  const init = async (file: string) => {
    await curl.isSupported(getData(file))
  }

  it("returns import info", async () => {
    await init("get")
    const info = await curl.getInfo()
    expect(info.name).toBe("example.com")
  })

  describe("Returns queries", () => {
    const getQueries = async (file: string) => {
      await init(file)
      const queries = await curl.getQueries("fake_datasource_id")
      expect(queries.length).toBe(1)
      return queries
    }

    const testVerb = async (file: string, verb: string) => {
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

    const testPath = async (file: string, urlPath: string) => {
      const queries = await getQueries(file)
      expect(queries[0].fields.path).toBe(urlPath)
    }

    it("populates path", async () => {
      await testPath("get", "http://example.com/")
      await testPath("path", "http://example.com/paths/abc")
    })

    const testHeaders = async (
      file: string,
      headers: Record<string, string>
    ) => {
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

    const testQuery = async (file: string, queryString: string) => {
      const queries = await getQueries(file)
      expect(queries[0].fields.queryString).toBe(queryString)
    }
    it("populates query", async () => {
      await testQuery("get", "")
      await testQuery("query", "q1=v1&q1=v2")
    })

    const testBody = async (file: string, body?: Record<string, any>) => {
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
