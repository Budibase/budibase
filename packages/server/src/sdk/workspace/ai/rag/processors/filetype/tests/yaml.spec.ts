import { yamlProcessor } from "../yaml"

describe("yamlProcessor", () => {
  it("extracts OpenAPI chunks from yaml", async () => {
    const chunks = await yamlProcessor.process({
      buffer: Buffer.from(`
openapi: 3.0.0
info:
  title: Pets API
  version: 1.2.3
paths:
  /pets:
    get:
      summary: List pets
      tags: [pets]
      parameters:
        - name: limit
          in: query
          required: false
      responses:
        "200":
          description: Success
components:
  schemas:
    Pet:
      description: A pet object
      properties:
        id:
          type: string
      `),
    })

    expect(chunks).toContain(
      ["OpenAPI 3.0.0", "Title: Pets API", "Version: 1.2.3"].join("\n")
    )
    expect(chunks).toContain(
      [
        "GET /pets",
        "List pets",
        "Tags: pets",
        "Parameters: limit (query) - optional",
        "Responses: 200: Success",
      ].join("\n")
    )
    expect(chunks).toContain(
      ["Schema: Pet", "A pet object", "Properties: id"].join("\n")
    )
  })

  it("falls back to plain chunking for invalid yaml", async () => {
    const content = "not: [valid"

    const chunks = await yamlProcessor.process({
      buffer: Buffer.from(content),
    })

    expect(chunks).toEqual(["not: [valid"])
  })

  it("falls back to plain chunking for non-openapi yaml", async () => {
    const content = `
name: SpongeBob
city: Bikini Bottom
    `

    const chunks = await yamlProcessor.process({
      buffer: Buffer.from(content),
    })

    expect(chunks).toEqual(["name: SpongeBob\ncity: Bikini Bottom"])
  })
})
