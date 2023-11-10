const TestConfig = require("../../../../../tests/utilities/TestConfiguration")
const { RestImporter } = require("../index")
const fs = require("fs")
const path = require('path')
const { events} = require("@budibase/backend-core")

const getData = (file) => {
  return fs.readFileSync(path.join(__dirname, `../sources/tests/${file}`), "utf8")
}

// openapi2 (swagger)
const oapi2CrudJson = getData("openapi2/data/crud/crud.json")
const oapi2CrudYaml = getData("openapi2/data/crud/crud.json")
const oapi2PetstoreJson = getData("openapi2/data/petstore/petstore.json")
const oapi2PetstoreYaml = getData("openapi2/data/petstore/petstore.json")

// openapi3 
const oapi3CrudJson = getData("openapi3/data/crud/crud.json")
const oapi3CrudYaml = getData("openapi3/data/crud/crud.json")
const oapi3PetstoreJson = getData("openapi3/data/petstore/petstore.json")
const oapi3PetstoreYaml = getData("openapi3/data/petstore/petstore.json")

// curl
const curl = getData("curl/data/post.txt")

const datasets = {
  // openapi2 (swagger)
  oapi2CrudJson,
  oapi2CrudYaml,
  oapi2PetstoreJson,
  oapi2PetstoreYaml,
  // openapi3
  oapi3CrudJson,
  oapi3CrudYaml,
  oapi3PetstoreJson,
  oapi3PetstoreYaml,
  // curl
  curl
}

describe("Rest Importer", () => {
  const config = new TestConfig(false)

  beforeAll(async () => {
    await config.init()
  })

  let restImporter 

  const init = async (data) => {
    restImporter = new RestImporter(data)
    await restImporter.init()
  }

  const runTest = async (test, assertions) => {
    await config.doInContext(config.appId, async () => {
      for (let [key, data] of Object.entries(datasets)) {
        await test(key, data, assertions)
      }
    })
  }

  const testGetInfo = async (key, data, assertions) => {
    await init(data)
    const info = await restImporter.getInfo()
    expect(info.name).toBe(assertions[key].name)
  }

  it("gets info", async () => {
    const assertions = {
      // openapi2 (swagger)
      "oapi2CrudJson" : {
        name: "CRUD",
      },
      "oapi2CrudYaml" : {
        name: "CRUD",
      },
      "oapi2PetstoreJson" : {
        name: "Swagger Petstore",
      },
      "oapi2PetstoreYaml" :{
        name: "Swagger Petstore",
      },
      // openapi3
      "oapi3CrudJson" : {
        name: "CRUD",
      },
      "oapi3CrudYaml" : {
        name: "CRUD",
      },
      "oapi3PetstoreJson" : {
        name: "Swagger Petstore - OpenAPI 3.0",
      },
      "oapi3PetstoreYaml" :{
        name: "Swagger Petstore - OpenAPI 3.0",
      },
      // curl
      "curl": {
        name: "example.com",
      }
    }
    await runTest(testGetInfo, assertions)
  })

  const testImportQueries = async (key, data, assertions) => {
    await init(data)
    const datasource = await config.createDatasource()
    const importResult = await restImporter.importQueries(datasource._id)
    expect(importResult.errorQueries.length).toBe(0)
    expect(importResult.queries.length).toBe(assertions[key].count)
    expect(events.query.imported).toBeCalledTimes(1)
    expect(events.query.imported).toBeCalledWith(datasource, assertions[key].source, assertions[key].count)
    jest.clearAllMocks()
  }

  it("imports queries", async () => {
    // simple sanity assertions that the whole dataset 
    // makes it through the importer
    const assertions = {
      // openapi2 (swagger)
      "oapi2CrudJson" : {
        count: 6,
        source: "openapi2.0",
      },
      "oapi2CrudYaml" :{
        count: 6,
        source: "openapi2.0"
      },
      "oapi2PetstoreJson" : {
        count: 20,
        source: "openapi2.0"
      },
      "oapi2PetstoreYaml" :{
        count: 20,
        source: "openapi2.0"
      },
      // openapi3
      "oapi3CrudJson" : {
        count: 6,
        source: "openapi3.0"
      },
      "oapi3CrudYaml" :{
        count: 6,
        source: "openapi3.0"
      },
      "oapi3PetstoreJson" : {
        count: 19,
        source: "openapi3.0"
      },
      "oapi3PetstoreYaml" :{
        count: 19,
        source: "openapi3.0"
      },
      // curl
      "curl": {
        count: 1,
        source: "curl"
      }
    }
    await runTest(testImportQueries, assertions)
  })
})