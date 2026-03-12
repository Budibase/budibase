import { parse as parseYaml } from "yaml"
import { chunkDocument, getDefaultChunkSize } from "../shared"
import type { RagFileProcessor, RagProcessInput } from "../types"

const formatParameters = (parameters: any[] = []) => {
  if (!Array.isArray(parameters) || parameters.length === 0) {
    return "None"
  }
  return parameters
    .map(param => {
      const location = param?.in ? `(${param.in})` : ""
      const required = param?.required ? "required" : "optional"
      return `${param?.name ?? "unknown"} ${location} - ${required}`
    })
    .join("; ")
}

const formatResponses = (responses: Record<string, any> = {}) => {
  const entries = Object.entries(responses)
  if (entries.length === 0) {
    return "None"
  }
  return entries
    .map(
      ([status, response]) =>
        `${status}: ${response?.description ?? "No description"}`
    )
    .join("; ")
}

const buildOpenApiChunks = (doc: Record<string, any>) => {
  if (!doc || typeof doc !== "object") {
    return []
  }

  const chunks: string[] = []

  if (doc.info) {
    chunks.push(
      [
        `OpenAPI ${doc.openapi ?? ""}`.trim(),
        doc.info.title ? `Title: ${doc.info.title}` : null,
        doc.info.version ? `Version: ${doc.info.version}` : null,
        doc.info.description ?? null,
      ]
        .filter(Boolean)
        .join("\n")
    )
  }

  if (doc.paths && typeof doc.paths === "object") {
    for (const [pathKey, methods] of Object.entries<any>(doc.paths)) {
      if (!methods || typeof methods !== "object") {
        continue
      }
      for (const [method, definition] of Object.entries<any>(methods)) {
        if (!definition || typeof definition !== "object") {
          continue
        }
        chunks.push(
          [
            `${method.toUpperCase()} ${pathKey}`,
            definition.summary ??
              definition.operationId ??
              "No summary provided",
            definition.description ?? "",
            Array.isArray(definition.tags)
              ? `Tags: ${definition.tags.join(", ")}`
              : "",
            `Parameters: ${formatParameters(definition.parameters)}`,
            `Responses: ${formatResponses(definition.responses)}`,
          ]
            .filter(Boolean)
            .join("\n")
        )
      }
    }
  }

  if (doc.components?.schemas) {
    for (const [schemaName, schemaDef] of Object.entries<any>(
      doc.components.schemas
    )) {
      const props =
        schemaDef?.properties && typeof schemaDef.properties === "object"
          ? Object.keys(schemaDef.properties).join(", ")
          : "No properties listed"
      chunks.push(
        [
          `Schema: ${schemaName}`,
          schemaDef?.description ?? "No description",
          `Properties: ${props}`,
        ].join("\n")
      )
    }
  }

  return chunks
}

export const yamlProcessor: RagFileProcessor = {
  async process(input: RagProcessInput) {
    const content = input.buffer.toString("utf-8")

    try {
      const parsed = parseYaml(content)
      const openApiChunks = buildOpenApiChunks(parsed)
      if (openApiChunks.length > 0) {
        return openApiChunks.flatMap(chunk =>
          chunk.length > getDefaultChunkSize() ? chunkDocument(chunk) : [chunk]
        )
      }
    } catch (error) {
      console.warn(
        "Failed to parse YAML for agent upload, falling back to plain chunking",
        error
      )
    }

    return chunkDocument(content)
  },
}
