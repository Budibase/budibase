import { parse as parseYaml } from "yaml"
import { chunkDocument, getDefaultChunkSize } from "../shared"
import type { RagFileProcessor, RagProcessInput } from "../types"

type YamlScalar = string | number | boolean | null

const isRecord = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== "object" || value === null) {
    return false
  }
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

const isYamlScalar = (value: unknown): value is YamlScalar => {
  return (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  )
}

const scalarToString = (value: YamlScalar): string => {
  if (value === null) {
    return "null"
  }
  return String(value)
}

const flattenYaml = (
  value: unknown,
  path: string[] = [],
  ancestors = new WeakSet<object>()
): string[] => {
  if (isYamlScalar(value)) {
    const key = path.join(".") || "value"
    return [`${key}: ${scalarToString(value)}`]
  }

  if (Array.isArray(value)) {
    if (ancestors.has(value)) {
      const key = path.join(".") || "value"
      return [`${key}: [Circular]`]
    }
    ancestors.add(value)
    if (value.length === 0) {
      const key = path.join(".") || "value"
      ancestors.delete(value)
      return [`${key}: []`]
    }

    if (value.every(isYamlScalar)) {
      const key = path.join(".") || "value"
      const rendered = value
        .map(item => scalarToString(item as YamlScalar))
        .join(", ")
      ancestors.delete(value)
      return [`${key}: ${rendered}`]
    }

    const lines = value.flatMap((item, index) =>
      flattenYaml(item, [...path, `[${index}]`], ancestors)
    )
    ancestors.delete(value)
    return lines
  }

  if (isRecord(value)) {
    if (ancestors.has(value)) {
      const key = path.join(".") || "value"
      return [`${key}: [Circular]`]
    }
    ancestors.add(value)
    const entries = Object.entries(value)
    if (entries.length === 0) {
      const key = path.join(".") || "value"
      ancestors.delete(value)
      return [`${key}: {}`]
    }
    const lines = entries.flatMap(([key, child]) =>
      flattenYaml(child, [...path, key], ancestors)
    )
    ancestors.delete(value)
    return lines
  }

  const key = path.join(".") || "value"
  return [`${key}: ${String(value)}`]
}

const buildYamlChunks = (doc: unknown): string[] => {
  if (isYamlScalar(doc)) {
    return [`value: ${scalarToString(doc)}`]
  }

  if (Array.isArray(doc)) {
    const lines = flattenYaml(doc)
    return lines.length > 0 ? [lines.join("\n")] : []
  }

  if (!isRecord(doc)) {
    return []
  }

  const chunks = Object.entries(doc).map(([topLevelKey, value]) => {
    const lines = flattenYaml(value, [topLevelKey])
    return lines.join("\n")
  })

  return chunks.filter(Boolean)
}

export const yamlProcessor: RagFileProcessor = {
  async process(input: RagProcessInput) {
    const content = input.buffer.toString("utf-8")

    try {
      const parsed = parseYaml(content)
      const genericChunks = buildYamlChunks(parsed)
      if (genericChunks.length > 0) {
        return genericChunks.flatMap(chunk =>
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
