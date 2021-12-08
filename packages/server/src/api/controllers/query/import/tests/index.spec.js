
const bulkDocs = jest.fn()
const db = jest.fn(() => {
  return {
    bulkDocs
  }
})
jest.mock("../../../../../db", () => db)

const { RestImporter } = require("../index")

const fs = require("fs")
const path = require('path')

const getData = (file) => {
  return fs.readFileSync(path.join(__dirname, `../sources/tests/${file}`), "utf8")
}

// openapi2 (swagger)
const oapi2CrudJson = getData("openapi2/data/crud/crud.json")
const oapi2CrudYaml = getData("openapi2/data/crud/crud.json")
const oapi2PetstoreJson = getData("openapi2/data/petstore/petstore.json")
const oapi2PetstoreYaml = getData("openapi2/data/petstore/petstore.json")

// curl
const curl = getData("curl/data/post.txt")

const datasets = {
  oapi2CrudJson,
  oapi2CrudYaml,
  oapi2PetstoreJson,
  oapi2PetstoreYaml,
  curl
}

describe("Rest Importer", () => {
  let restImporter 

  const init = async (data) => {
    restImporter = new RestImporter(data)
    await restImporter.init()
  }

  const runTest = async (test, assertions) => {
    for (let [key, data] of Object.entries(datasets)) {
      await test(key, data, assertions)
    }
  }

  const testGetInfo = async (key, data, assertions) => {
    await init(data)
    const info = await restImporter.getInfo()
    expect(info.name).toBe(assertions[key].name)
    expect(info.url).toBe(assertions[key].url)
  }

  it("gets info", async () => {
    const assertions = {
      "oapi2CrudJson" : {
        name: "CRUD",
        url: "http://example.com"
      },
      "oapi2CrudYaml" : {
        name: "CRUD",
        url: "http://example.com"
      },
      "oapi2PetstoreJson" : {
        name: "Swagger Petstore",
        url: "https://petstore.swagger.io/v2"
      },
      "oapi2PetstoreYaml" :{
        name: "Swagger Petstore",
        url: "https://petstore.swagger.io/v2"
      },
      "curl": {
        name: "example.com",
        url: "http://example.com"
      }
    }
    await runTest(testGetInfo, assertions)
  })

  const testImportQueries = async (key, data, assertions) => {
    await init(data)
    bulkDocs.mockReturnValue([])
    const importResult = await restImporter.importQueries("appId", "datasourceId")
    expect(importResult.errorQueries.length).toBe(0)
    expect(importResult.queries.length).toBe(assertions[key].count)
    expect(bulkDocs).toHaveBeenCalledTimes(1)
    jest.clearAllMocks()
  }

  it("imports queries", async () => {
    // simple sanity assertions that the whole dataset 
    // makes it through the importer
    const assertions = {
      "oapi2CrudJson" : {
        count: 6,
      },
      "oapi2CrudYaml" :{
        count: 6,
      },
      "oapi2PetstoreJson" : {
        count: 20,
      },
      "oapi2PetstoreYaml" :{
        count: 20,
      },
      "curl": {
        count: 1
      }
    }
    await runTest(testImportQueries, assertions)
  })
})