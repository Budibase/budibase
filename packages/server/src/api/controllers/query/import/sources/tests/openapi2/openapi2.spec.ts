import { OpenAPI2 } from "../../openapi2"
import { readFileSync } from "fs"
import { join } from "path"
import { groupBy, mapValues } from "lodash"
import { Query } from "@budibase/types"

const getData = (file: string, extension: string) => {
  return readFileSync(
    join(__dirname, `./data/${file}/${file}.${extension}`),
    "utf8"
  )
}

describe("OpenAPI2 Import", () => {
  let openapi2: OpenAPI2

  beforeEach(() => {
    openapi2 = new OpenAPI2()
  })

  it("validates unsupported data", async () => {
    expect(await openapi2.isSupported("curl http://example.com")).toBe(false)
    expect(await openapi2.isSupported("")).toBe(false)
  })

  describe.each(["json", "yaml"])("%s", extension => {
    describe("petstore", () => {
      beforeEach(async () => {
        await openapi2.isSupported(getData("petstore", extension))
      })

      it("returns import info", async () => {
        const { name } = await openapi2.getInfo()
        expect(name).toBe("Swagger Petstore")
      })
    })

    describe("crud", () => {
      let queries: Record<string, Query>
      beforeEach(async () => {
        await openapi2.isSupported(getData("crud", extension))

        const raw = await openapi2.getQueries("fake_datasource_id")
        queries = mapValues(groupBy(raw, "name"), group => group[0])
      })

      it("should have 6 queries", () => {
        expect(Object.keys(queries).length).toBe(6)
      })

      it.each([
        ["createEntity", "create"],
        ["getEntities", "read"],
        ["getEntity", "read"],
        ["updateEntity", "update"],
        ["patchEntity", "patch"],
        ["deleteEntity", "delete"],
      ])("should have correct verb for %s", (operationId, method) => {
        expect(queries[operationId].queryVerb).toBe(method)
      })

      it.each([
        ["createEntity", "http://example.com/entities"],
        ["getEntities", "http://example.com/entities"],
        ["getEntity", "http://example.com/entities/{{entityId}}"],
        ["updateEntity", "http://example.com/entities/{{entityId}}"],
        ["patchEntity", "http://example.com/entities/{{entityId}}"],
        ["deleteEntity", "http://example.com/entities/{{entityId}}"],
      ])("should have correct path for %s", (operationId, urlPath) => {
        expect(queries[operationId].fields.path).toBe(urlPath)
      })

      it.each([
        ["createEntity", { "Content-Type": "application/json" }],
        ["getEntities", {}],
        ["getEntity", {}],
        ["updateEntity", { "Content-Type": "application/json" }],
        ["patchEntity", { "Content-Type": "application/json" }],
        ["deleteEntity", { "x-api-key": "{{x-api-key}}" }],
      ])(`should have correct headers for %s`, (operationId, headers) => {
        expect(queries[operationId].fields.headers).toStrictEqual(headers)
      })

      it.each([
        ["createEntity", ""],
        ["getEntities", "page={{page}}&size={{size}}"],
        ["getEntity", ""],
        ["updateEntity", ""],
        ["patchEntity", ""],
        ["deleteEntity", ""],
      ])(
        `should have correct query string for %s`,
        (operationId, queryString) => {
          expect(queries[operationId].fields.queryString).toBe(queryString)
        }
      )

      it.each([
        ["createEntity", []],
        [
          "getEntities",
          [
            { name: "page", default: "" },
            { name: "size", default: "" },
          ],
        ],
        ["getEntity", [{ name: "entityId", default: "" }]],
        ["updateEntity", [{ name: "entityId", default: "" }]],
        ["patchEntity", [{ name: "entityId", default: "" }]],
        [
          "deleteEntity",
          [
            { name: "entityId", default: "" },
            { name: "x-api-key", default: "" },
          ],
        ],
      ])(`should have correct parameters for %s`, (operationId, parameters) => {
        expect(queries[operationId].parameters).toStrictEqual(parameters)
      })

      it.each([
        ["createEntity", { name: "name", type: "type" }],
        ["getEntities", undefined],
        ["getEntity", undefined],
        ["updateEntity", { id: 1, name: "name", type: "type" }],
        ["patchEntity", { id: 1, name: "name", type: "type" }],
        ["deleteEntity", undefined],
      ])(`should have correct body for %s`, (operationId, body) => {
        expect(queries[operationId].fields.requestBody).toBe(
          JSON.stringify(body, null, 2)
        )
      })
    })
  })
})
