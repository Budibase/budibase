import MarkdownIt from "markdown-it"
import { chunkDocument, getDefaultChunkSize } from "../shared"
import type { RagFileProcessor, RagProcessInput } from "../types"

const markdownParser = new MarkdownIt()

const normalizeMarkdownText = (value: string) =>
  value.replace(/\s+/g, " ").replace(/\|/g, " ").trim()

const normalizeMultilineMarkdownText = (value: string) =>
  value
    .split(/\r?\n/)
    .map(line => normalizeMarkdownText(line))
    .filter(Boolean)
    .join("\n")

const buildContextualFact = (
  context: string[],
  text: string,
  options?: {
    preserveLineBreaks?: boolean
  }
) => {
  const normalizedText = options?.preserveLineBreaks
    ? normalizeMultilineMarkdownText(text)
    : normalizeMarkdownText(text)
  if (!normalizedText) {
    return null
  }
  const normalizedContext = context.filter(Boolean)
  return normalizedContext.length > 0
    ? `${normalizedContext.join(" > ")}\n${normalizedText}`
    : normalizedText
}

const pushChunk = (chunks: string[], facts: string[]) => {
  if (facts.length === 0) {
    return
  }
  const pendingFacts = [...facts]
  facts.length = 0
  for (const fact of pendingFacts) {
    const normalized = fact.trim()
    if (!normalized) {
      continue
    }
    if (normalized.length > getDefaultChunkSize()) {
      chunks.push(...chunkDocument(normalized))
    } else {
      chunks.push(normalized)
    }
  }
}

const collectUntilClose = (
  tokens: MarkdownIt.Token[],
  start: number,
  closeType: string
) => {
  const values: string[] = []
  const openType = closeType.endsWith("_close")
    ? closeType.replace("_close", "_open")
    : ""
  let nestedDepth = 0
  let index = start + 1
  while (index < tokens.length) {
    const token = tokens[index]
    if (openType && token.type === openType) {
      nestedDepth += 1
      index += 1
      continue
    }
    if (token.type === closeType) {
      if (nestedDepth > 0) {
        nestedDepth -= 1
        index += 1
        continue
      }
      return {
        value: values.join(" "),
        nextIndex: index,
      }
    }
    if (
      token.type === "inline" ||
      token.type === "fence" ||
      token.type === "code_block"
    ) {
      values.push(token.content)
    }
    index += 1
  }
  return {
    value: values.join(" "),
    nextIndex: index - 1,
  }
}

const collectListItemFact = (tokens: MarkdownIt.Token[], start: number) => {
  const ownValues: string[] = []
  const childValues: string[] = []
  let index = start + 1

  while (index < tokens.length) {
    const token = tokens[index]

    if (token.type === "list_item_open") {
      const { value, nextIndex } = collectListItemFact(tokens, index)
      if (value) {
        childValues.push(value)
      }
      index = nextIndex + 1
      continue
    }

    if (token.type === "list_item_close") {
      const ownValue = normalizeMarkdownText(ownValues.join(" "))
      const normalizedChildren = childValues
        .map(value => normalizeMultilineMarkdownText(value))
        .filter(Boolean)

      if (ownValue && normalizedChildren.length > 0) {
        const childLines = normalizedChildren.flatMap(child => {
          const lines = child.split("\n").filter(Boolean)
          if (lines.length === 0) {
            return []
          }
          const [first, ...rest] = lines
          return [`- ${first}`, ...rest.map(line => `  ${line}`)]
        })
        return {
          value: `${ownValue}:\n${childLines.join("\n")}`,
          nextIndex: index,
        }
      }

      if (ownValue) {
        return {
          value: ownValue,
          nextIndex: index,
        }
      }

      return {
        value: normalizedChildren.join(", "),
        nextIndex: index,
      }
    }

    if (
      token.type === "inline" ||
      token.type === "fence" ||
      token.type === "code_block"
    ) {
      ownValues.push(token.content)
    }

    index += 1
  }

  return {
    value: normalizeMarkdownText(ownValues.join(" ")),
    nextIndex: index - 1,
  }
}

const parseTableFacts = (
  tokens: MarkdownIt.Token[],
  startIndex: number,
  context: string[]
) => {
  const headers: string[] = []
  const rows: string[][] = []
  let currentRow: string[] = []
  let inHead = false
  let index = startIndex + 1

  while (index < tokens.length) {
    const token = tokens[index]

    if (token.type === "table_close") {
      break
    }

    if (token.type === "thead_open") {
      inHead = true
      index += 1
      continue
    }

    if (token.type === "thead_close") {
      inHead = false
      index += 1
      continue
    }

    if (token.type === "tr_open") {
      currentRow = []
      index += 1
      continue
    }

    if (token.type === "tr_close") {
      if (inHead) {
        headers.splice(0, headers.length, ...currentRow)
      } else if (currentRow.length > 0) {
        rows.push(currentRow)
      }
      index += 1
      continue
    }

    if (token.type === "th_open") {
      const { value, nextIndex } = collectUntilClose(tokens, index, "th_close")
      currentRow.push(normalizeMarkdownText(value))
      index = nextIndex + 1
      continue
    }

    if (token.type === "td_open") {
      const { value, nextIndex } = collectUntilClose(tokens, index, "td_close")
      currentRow.push(normalizeMarkdownText(value))
      index = nextIndex + 1
      continue
    }

    index += 1
  }

  const facts = rows
    .map(row => {
      const values = row
        .map((text, columnIndex) => {
          const header = headers[columnIndex]
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

  return {
    facts,
    nextIndex: index,
  }
}

export const markdownProcessor: RagFileProcessor = {
  async process(input: RagProcessInput) {
    const content = input.buffer.toString("utf-8")
    const tokens = markdownParser.parse(content, {})
    if (tokens.length === 0) {
      return chunkDocument(content)
    }

    const chunks: string[] = []
    const context: string[] = []
    const facts: string[] = []
    let listDepth = 0

    for (let index = 0; index < tokens.length; index += 1) {
      const token = tokens[index]

      if (token.type === "heading_open") {
        pushChunk(chunks, facts)
        const headingLevel =
          Number.parseInt((token.tag || "h1").replace("h", ""), 10) || 1
        const nextToken = tokens[index + 1]
        const heading = normalizeMarkdownText(
          nextToken?.type === "inline" ? nextToken.content : ""
        )
        if (heading) {
          context.splice(Math.max(0, headingLevel - 1))
          context[headingLevel - 1] = heading
        }
        continue
      }

      if (token.type === "table_open") {
        pushChunk(chunks, facts)
        const { facts: tableFacts, nextIndex } = parseTableFacts(
          tokens,
          index,
          context
        )
        chunks.push(...tableFacts)
        index = nextIndex
        continue
      }

      if (
        token.type === "bullet_list_open" ||
        token.type === "ordered_list_open"
      ) {
        listDepth += 1
        continue
      }

      if (
        token.type === "bullet_list_close" ||
        token.type === "ordered_list_close"
      ) {
        listDepth = Math.max(0, listDepth - 1)
        continue
      }

      if (token.type === "list_item_open") {
        const { value, nextIndex } = collectListItemFact(tokens, index)
        const fact = buildContextualFact(context, value, {
          preserveLineBreaks: true,
        })
        if (fact) {
          facts.push(fact)
        }
        index = nextIndex
        continue
      }

      if (token.type === "paragraph_open" && listDepth === 0) {
        const { value, nextIndex } = collectUntilClose(
          tokens,
          index,
          "paragraph_close"
        )
        const fact = buildContextualFact(context, value)
        if (fact) {
          facts.push(fact)
        }
        index = nextIndex
        continue
      }

      if (token.type === "fence" || token.type === "code_block") {
        const fact = buildContextualFact(context, token.content)
        if (fact) {
          facts.push(fact)
        }
      }
    }

    pushChunk(chunks, facts)
    return chunks.length > 0 ? chunks : chunkDocument(content)
  },
}
