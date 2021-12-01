// const Airtable = require("airtable")
// const AirtableIntegration = require("../airtable")
const { Curl } = require("../../curl")
const fs = require("fs")
const path = require('path')
jest.mock("airtable")

// class TestConfiguration {
//   constructor(config = {}) {
//     this.integration = new AirtableIntegration.integration(config) 
//     this.client = {
//       create: jest.fn(),
//       select: jest.fn(),
//       update: jest.fn(),
//       destroy: jest.fn(),
//     }
//     this.integration.client = () => this.client 
//   }
// }

const getData = (file) => {
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

  it("returns import info", async () => {
    const data = getData()
    await curl.isSupported(data)
    const info = await curl.getInfo()
    expect(info.url).toBe("http://example.com")
    expect(info.name).toBe("example.com")
  })
  
  describe("Returns queries", () => {
    describe("populates verb", () => {
      const testVerb = async (file, verb) => {
        const data = getData(file)
        await curl.isSupported(data)
        const queries = await curl.getQueries(data)
        expect(queries.length).toBe(1)
        expect(queries[0].verb).toBe(verb)
      }
      it("populates verb", async () => {
        await testVerb("get", "read")
        await testVerb("post", "create")
        await testVerb("put", "update")
        await testVerb("delete", "delete")
        await testVerb("patch", "patch")
      })        
    })

    it("populates path", async () => {
        
    })

    it("populates headers", async () => {
        
    })

    it("populates query", async () => {
        
    })

    it("populates body", async () => {
        
    })
  })
})