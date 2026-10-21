import { findHBSBlocks } from "@budibase/string-templates"
import sdk from "../../sdk"

interface AqlFields {
  sql: string
  [key: string]: unknown
}

export const interpolateAQL = async (
  fields: AqlFields,
  parameters: Record<string, unknown>
) => {
  const { sql } = fields
  const blocks = findHBSBlocks(sql)
  if (!blocks.length) {
    return fields
  }

  const templates: string[] = []
  const bind = (block: string) => {
    const identifier = `value${templates.length}`
    templates.push(block)
    return `@${identifier}`
  }
  const parts: string[] = []

  for (let index = 0; index < sql.length; ) {
    const character = sql[index]
    if (character === '"' || character === "'") {
      const quote = character
      let end = index + 1
      while (end < sql.length) {
        if (sql[end] === "\\") {
          end += 2
        } else if (sql[end] === quote) {
          break
        } else {
          end++
        }
      }
      if (end === sql.length) {
        parts.push(sql.slice(index))
        break
      }

      const literal = sql.slice(index + 1, end)
      const expressions: string[] = []
      let offset = 0
      while (offset < literal.length) {
        const next = blocks
          .map(block => ({ block, position: literal.indexOf(block, offset) }))
          .filter(match => match.position !== -1)
          .sort((left, right) => left.position - right.position)[0]
        if (!next) {
          break
        }
        if (next.position > offset) {
          expressions.push(
            `${quote}${literal.slice(offset, next.position)}${quote}`
          )
        }
        expressions.push(bind(next.block))
        offset = next.position + next.block.length
      }
      if (expressions.length) {
        if (offset < literal.length) {
          expressions.push(`${quote}${literal.slice(offset)}${quote}`)
        }
        parts.push(
          expressions.length === 1
            ? expressions[0]
            : `CONCAT(${expressions.join(", ")})`
        )
      } else {
        parts.push(sql.slice(index, end + 1))
      }
      index = end + 1
      continue
    }

    const block = blocks.find(candidate => sql.startsWith(candidate, index))
    if (block) {
      parts.push(bind(block))
      index += block.length
    } else {
      parts.push(character)
      index++
    }
  }

  const values = await sdk.queries.enrichArrayContext(templates, parameters, {
    escapeNewlines: false,
  })
  const bindVars = Object.fromEntries(
    values.map((value, index) => [`value${index}`, value])
  )
  return { ...fields, sql: parts.join(""), bindVars }
}
