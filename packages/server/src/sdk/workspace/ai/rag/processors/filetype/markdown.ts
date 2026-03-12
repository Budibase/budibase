import { toString } from "mdast-util-to-string"
import { remark } from "remark"
import remarkGfm from "remark-gfm"
import remarkParse from "remark-parse"
import { chunkDocument, getDefaultChunkSize } from "../shared"
import type { RagFileProcessor, RagProcessInput } from "../types"

interface MdNode {
  type: string
  depth?: number
  children?: MdNode[]
}

interface MdTable extends MdNode {
  children: Array<{
    type: "tableRow"
    children: Array<{ type: "tableCell"; children?: MdNode[] }>
  }>
}

const parseMarkdown = (content: string) =>
  remark().use(remarkParse).use(remarkGfm).parse(content) as MdNode

const normalizeMarkdownText = (value: string) =>
  value.replace(/\s+/g, " ").replace(/\|/g, " ").trim()

const buildContextualFact = (context: string[], text: string) => {
  const normalizedText = normalizeMarkdownText(text)
  if (!normalizedText) {
    return null
  }
  return context.length > 0
    ? `${context.join(" > ")}\n${normalizedText}`
    : normalizedText
}

const pushChunk = (chunks: string[], facts: string[]) => {
  if (facts.length === 0) {
    return
  }
  const block = facts.join("\n").trim()
  facts.length = 0
  if (!block) {
    return
  }
  if (block.length > getDefaultChunkSize()) {
    chunks.push(...chunkDocument(block))
  } else {
    chunks.push(block)
  }
}

const extractTableFacts = (table: MdTable, context: string[]) => {
  const [headerRow, ...bodyRows] = table.children || []
  if (!headerRow || bodyRows.length === 0) {
    return []
  }

  const headers = headerRow.children.map(cell =>
    normalizeMarkdownText(toString(cell))
  )

  return bodyRows
    .map(row => {
      const values = row.children
        .map((cell, index) => {
          const header = headers[index]
          const text = normalizeMarkdownText(toString(cell))
          if (!header || !text) {
            return null
          }
          return `${header}: ${text}`
        })
        .filter(Boolean)
        .join("; ")

      return buildContextualFact(context, values)
    })
    .filter((value): value is string => !!value)
}

export const markdownProcessor: RagFileProcessor = {
  async process(input: RagProcessInput) {
    const content = input.buffer.toString("utf-8")
    const tree = parseMarkdown(content)
    const children = tree.children || []
    if (children.length === 0) {
      return chunkDocument(content)
    }

    const chunks: string[] = []
    const context: string[] = []
    const facts: string[] = []

    for (const node of children) {
      if (node.type === "heading") {
        pushChunk(chunks, facts)
        const level = node.depth || 1
        const heading = normalizeMarkdownText(toString(node))
        if (!heading) {
          continue
        }
        context.splice(Math.max(0, level - 1))
        context[level - 1] = heading
        continue
      }

      if (node.type === "table") {
        pushChunk(chunks, facts)
        chunks.push(...extractTableFacts(node as MdTable, context))
        continue
      }

      if (node.type === "list") {
        for (const item of node.children || []) {
          const fact = buildContextualFact(context, toString(item))
          if (fact) {
            facts.push(fact)
          }
        }
        continue
      }

      if (node.type === "paragraph" || node.type === "blockquote") {
        const fact = buildContextualFact(context, toString(node))
        if (fact) {
          facts.push(fact)
        }
        continue
      }

      if (node.type === "code") {
        const fact = buildContextualFact(context, toString(node))
        if (fact) {
          facts.push(fact)
        }
      }
    }

    pushChunk(chunks, facts)
    return chunks.length > 0 ? chunks : chunkDocument(content)
  },
}
