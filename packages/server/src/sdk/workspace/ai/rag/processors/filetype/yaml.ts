import { isAlias, isMap, isPair, isScalar, isSeq, parseDocument } from "yaml"
import { chunkDocument, getDefaultChunkSize } from "../shared"
import type { RagFileProcessor, RagProcessInput } from "../types"

type YamlScalar = string | number | boolean | null
type YamlDocument = ReturnType<typeof parseDocument>

const isYamlScalar = (value: unknown): value is YamlScalar => {
  return (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  )
}

const scalarToString = (value: unknown): string => {
  if (value === null) {
    return "null"
  }
  return String(value)
}

const pathToKey = (path: string[]) => path.join(".") || "value"

const isYamlSetMap = (node: unknown) => {
  return isMap(node) && node.tag === "tag:yaml.org,2002:set"
}

const scalarFromNode = (
  node: unknown,
  doc: YamlDocument,
  aliasStack = new Set<string>()
): YamlScalar | undefined => {
  if (node === null) {
    return null
  }

  if (isScalar(node)) {
    return isYamlScalar(node.value) ? node.value : undefined
  }

  if (isAlias(node)) {
    if (aliasStack.has(node.source)) {
      return undefined
    }
    aliasStack.add(node.source)
    const resolved = node.resolve(doc)
    const value = scalarFromNode(resolved, doc, aliasStack)
    aliasStack.delete(node.source)
    return value
  }

  return undefined
}

const keyFromNode = (node: unknown, doc: YamlDocument): string => {
  const scalarValue = scalarFromNode(node, doc)
  if (scalarValue !== undefined) {
    return scalarToString(scalarValue)
  }

  if (isScalar(node)) {
    return scalarToString(node.value)
  }

  return scalarToString(node)
}

const flattenYamlNode = (
  node: unknown,
  path: string[] = [],
  doc: YamlDocument,
  ancestors = new WeakSet<object>()
): string[] => {
  const key = pathToKey(path)

  if (node === null) {
    return [`${key}: null`]
  }

  if (isAlias(node)) {
    const resolved = node.resolve(doc)
    if (!resolved) {
      return [`${key}: [UnresolvedAlias]`]
    }
    if ((isMap(resolved) || isSeq(resolved)) && ancestors.has(resolved)) {
      return [`${key}: [Circular]`]
    }
    return flattenYamlNode(resolved, path, doc, ancestors)
  }

  if (isScalar(node)) {
    return [`${key}: ${scalarToString(node.value)}`]
  }

  if (isSeq(node)) {
    if (ancestors.has(node)) {
      return [`${key}: [Circular]`]
    }

    ancestors.add(node)
    if (node.items.length === 0) {
      ancestors.delete(node)
      return [`${key}: []`]
    }

    const scalarItems = node.items.map(item => scalarFromNode(item, doc))
    if (scalarItems.every(item => item !== undefined)) {
      const rendered = scalarItems.map(item => scalarToString(item)).join(", ")
      ancestors.delete(node)
      return [`${key}: ${rendered}`]
    }

    const lines = node.items.flatMap((item, index) =>
      flattenYamlNode(item, [...path, `[${index}]`], doc, ancestors)
    )
    ancestors.delete(node)
    return lines
  }

  if (isMap(node)) {
    if (ancestors.has(node)) {
      return [`${key}: [Circular]`]
    }

    ancestors.add(node)
    if (node.items.length === 0) {
      ancestors.delete(node)
      return [`${key}: []`]
    }

    if (isYamlSetMap(node)) {
      const setKeys = node.items
        .filter(isPair)
        .map(pair => scalarFromNode(pair.key, doc))

      if (setKeys.length > 0 && setKeys.every(value => value !== undefined)) {
        const rendered = setKeys.map(value => scalarToString(value)).join(", ")
        ancestors.delete(node)
        return [`${key}: ${rendered}`]
      }
    }

    const lines = node.items.flatMap((item, index) => {
      if (!isPair(item)) {
        return flattenYamlNode(item, [...path, `[${index}]`], doc, ancestors)
      }

      if (isYamlSetMap(node)) {
        return flattenYamlNode(
          item.key,
          [...path, `[${index}]`],
          doc,
          ancestors
        )
      }

      const entryKey = keyFromNode(item.key, doc)
      return flattenYamlNode(item.value, [...path, entryKey], doc, ancestors)
    })

    ancestors.delete(node)
    return lines
  }

  return [`${key}: ${scalarToString(node)}`]
}

const buildYamlChunks = (doc: YamlDocument): string[] => {
  const root = doc.contents
  if (!root) {
    return []
  }

  if (isMap(root) && !isYamlSetMap(root)) {
    const chunks = root.items.flatMap((item, index) => {
      if (!isPair(item)) {
        const lines = flattenYamlNode(item, [`[${index}]`], doc)
        return lines.length > 0 ? [lines.join("\n")] : []
      }

      const topLevelKey = keyFromNode(item.key, doc)
      const lines = flattenYamlNode(item.value, [topLevelKey], doc)
      return lines.length > 0 ? [lines.join("\n")] : []
    })

    return chunks.filter(Boolean)
  }

  const lines = flattenYamlNode(root, [], doc)
  return lines.length > 0 ? [lines.join("\n")] : []
}

export const yamlProcessor: RagFileProcessor = {
  async process(input: RagProcessInput) {
    const content = input.buffer.toString("utf-8")

    try {
      const doc = parseDocument(content)
      if (doc.errors.length > 0) {
        throw doc.errors[0]
      }

      const chunks = buildYamlChunks(doc)
      if (chunks.length > 0) {
        return chunks.flatMap(chunk =>
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
