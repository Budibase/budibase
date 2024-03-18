import helpers from "@budibase/handlebars-helpers"
import { HelperFunctionBuiltin } from "../src/helpers/constants"
import fs from "fs"
import doctrine, { Annotation } from "doctrine"
import marked from "marked"

/**
 * full list of supported helpers can be found here:
 * https://github.com/budibase/handlebars-helpers
 */
import path, { join } from "path"

const COLLECTIONS = [
  "math",
  "array",
  "number",
  "url",
  "string",
  "comparison",
  "object",
  "uuid",
]
const FILENAME = join(__dirname, "..", "src", "manifest.json")
const outputJSON = {}
const ADDED_HELPERS = {
  date: {
    date: {
      args: ["datetime", "format"],
      numArgs: 2,
      example: '{{date now "DD-MM-YYYY" "America/New_York" }} -> 21-01-2021',
      description:
        "Format a date using moment.js date formatting - the timezone is optional and uses the tz database.",
    },
    duration: {
      args: ["time", "durationType"],
      numArgs: 2,
      example: '{{duration 8 "seconds"}} -> a few seconds',
      description:
        "Produce a humanized duration left/until given an amount of time and the type of time measurement.",
    },
  },
}

function fixSpecialCases(name, obj) {
  const args = obj.args
  if (name === "ifNth") {
    args[0] = "a"
    args[1] = "b"
  }
  if (name === "eachIndex") {
    obj.description = "Iterates the array, listing an item and the index of it."
  }
  if (name === "toFloat") {
    obj.description = "Convert input to a float."
  }
  if (name === "toInt") {
    obj.description = "Convert input to an integer."
  }
  return obj
}

function lookForward(lines, funcLines, idx) {
  const funcLen = funcLines.length
  for (let i = idx, j = 0; i < idx + funcLen; ++i, j++) {
    if (!lines[i].includes(funcLines[j])) {
      return false
    }
  }
  return true
}

interface CommentInfo extends Annotation {
  acceptsBlock?: boolean
  acceptsInline?: boolean
  example?: string
}

function getCommentInfo(file, func): CommentInfo {
  const lines = file.split("\n")
  const funcLines = func.split("\n")
  let comment = null
  for (let idx = 0; idx < lines.length; ++idx) {
    // from here work back until we have the comment
    if (lookForward(lines, funcLines, idx)) {
      let fromIdx = idx
      let start = 0,
        end = 0
      do {
        if (lines[fromIdx].includes("*/")) {
          end = fromIdx
        } else if (lines[fromIdx].includes("/*")) {
          start = fromIdx
        }
        if (start && end) {
          break
        }
        fromIdx--
      } while (fromIdx > 0)
      comment = lines.slice(start, end + 1).join("\n")
    }
  }
  if (comment == null) {
    return { description: "", tags: [] }
  }
  const docs = doctrine.parse(comment, { unwrap: true }) as CommentInfo
  // some hacky fixes
  docs.description = docs.description.replace(/\n/g, " ")
  docs.description = docs.description.replace(/[ ]{2,}/g, " ")
  docs.description = docs.description.replace(/is is/g, "is")
  const examples = docs.tags
    .filter(el => el.title === "example")
    .map(el => el.description)
  const blocks = docs.description.split("```")
  if (examples.length > 0) {
    docs.example = examples.join(" ")
  }
  // hacky example fix
  if (docs.example && docs.example.includes("product")) {
    docs.example = docs.example.replace("product", "multiply")
  }
  docs.description = blocks[0].trim()
  docs.acceptsBlock = docs.tags.some(el => el.title === "block")
  docs.acceptsInline = docs.tags.some(el => el.title === "inline")
  return docs
}

const excludeFunctions = { string: ["raw"] }

/**
 * This script is very specific to purpose, parsing the handlebars-helpers files to attempt to get information about them.
 */
function run() {
  const foundNames: string[] = []
  for (const collection of COLLECTIONS) {
    const collectionFile = fs.readFileSync(
      `${path.dirname(
        require.resolve("@budibase/handlebars-helpers")
      )}/lib/${collection}.js`,
      "utf8"
    )
    const collectionInfo = {}
    // collect information about helper
    const hbsHelperInfo = helpers[collection]()
    for (const entry of Object.entries(hbsHelperInfo)) {
      const name = entry[0]
      // skip built in functions and ones seen already
      if (
        HelperFunctionBuiltin.indexOf(name) !== -1 ||
        foundNames.indexOf(name) !== -1 ||
        excludeFunctions[collection]?.includes(name)
      ) {
        continue
      }
      foundNames.push(name)
      // this is ridiculous, but it parse the function header
      const fnc = entry[1]!.toString()
      const jsDocInfo = getCommentInfo(collectionFile, fnc)
      const args = jsDocInfo.tags
        .filter(tag => tag.title === "param")
        .map(
          tag =>
            tag.description &&
            tag.description.replace(/`/g, "").split(" ")[0].trim()
        )
      collectionInfo[name] = fixSpecialCases(name, {
        args,
        numArgs: args.length,
        example: jsDocInfo.example || undefined,
        description: jsDocInfo.description,
        requiresBlock: jsDocInfo.acceptsBlock && !jsDocInfo.acceptsInline,
      })
    }
    outputJSON[collection] = collectionInfo
  }
  // add extra helpers
  for (const [collectionName, collection] of Object.entries(ADDED_HELPERS)) {
    let input = collection
    if (outputJSON[collectionName]) {
      input = Object.assign(outputJSON[collectionName], collection)
    }
    outputJSON[collectionName] = input
  }

  // convert all markdown to HTML
  for (const collection of Object.values<any>(outputJSON)) {
    for (const helper of Object.values<any>(collection)) {
      // @ts-expect-error - I tried adding @types/marked as a dependency and it caused
      // really weird problems, the @budibase/types package started failing its build
      helper.description = marked.parse(helper.description)
    }
  }
  fs.writeFileSync(FILENAME, JSON.stringify(outputJSON, null, 2))
}

run()
