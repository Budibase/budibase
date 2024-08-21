import {
  HelperFunctionBuiltin,
  EXTERNAL_FUNCTION_COLLECTIONS,
} from "../src/helpers/constants"
import { readFileSync, writeFileSync } from "fs"
import { marked } from "marked"
import { join, dirname } from "path"

const helpers = require("@budibase/handlebars-helpers")
const doctrine = require("doctrine")

type HelperInfo = {
  acceptsInline?: boolean
  acceptsBlock?: boolean
  example?: string
  description: string
  tags?: any[]
}

const FILENAME = join(__dirname, "..", "src", "manifest.json")
const outputJSON: any = {}
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

function fixSpecialCases(name: string, obj: any) {
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

function lookForward(lines: string[], funcLines: string[], idx: number) {
  const funcLen = funcLines.length
  for (let i = idx, j = 0; i < idx + funcLen; ++i, j++) {
    if (!lines[i].includes(funcLines[j])) {
      return false
    }
  }
  return true
}

function getCommentInfo(file: string, func: string): HelperInfo {
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
    return { description: "" }
  }
  const docs: {
    acceptsInline?: boolean
    acceptsBlock?: boolean
    example: string
    description: string
    tags: any[]
  } = doctrine.parse(comment, { unwrap: true })
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

const excludeFunctions: Record<string, string[]> = { string: ["raw"] }

/**
 * This script is very specific to purpose, parsing the handlebars-helpers files to attempt to get information about them.
 */
function run() {
  const foundNames: string[] = []
  for (let collection of EXTERNAL_FUNCTION_COLLECTIONS) {
    const collectionFile = readFileSync(
      `${dirname(
        require.resolve("@budibase/handlebars-helpers")
      )}/lib/${collection}.js`,
      "utf8"
    )
    const collectionInfo: any = {}
    // collect information about helper
    let hbsHelperInfo = helpers[collection]()
    for (let entry of Object.entries(hbsHelperInfo)) {
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
      let args = jsDocInfo.tags
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
  for (let [collectionName, collection] of Object.entries(ADDED_HELPERS)) {
    let input = collection
    if (outputJSON[collectionName]) {
      input = Object.assign(outputJSON[collectionName], collection)
    }
    outputJSON[collectionName] = input
  }

  // convert all markdown to HTML
  for (let collection of Object.values<any>(outputJSON)) {
    for (let helper of Object.values<any>(collection)) {
      helper.description = marked.parse(helper.description)
    }
  }
  writeFileSync(FILENAME, JSON.stringify(outputJSON, null, 2))
}

run()
