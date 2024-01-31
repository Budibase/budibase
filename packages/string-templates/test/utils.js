const { getManifest } = require("../src")
const { getJsHelperList } = require("../src/helpers")

const {
  convertToJS,
  processStringSync,
  encodeJSBinding,
} = require("../src/index.cjs")

function tryParseJson(str) {
  if (typeof str !== "string") {
    return
  }

  try {
    return JSON.parse(str.replace(/\'/g, '"'))
  } catch (e) {
    return
  }
}

const getParsedManifest = () => {
  const manifest = getManifest()
  const collections = Object.keys(manifest)
  const examples = collections.reduce((acc, collection) => {
    const functions = Object.entries(manifest[collection])
      .filter(([_, details]) => details.example)
      .map(([name, details]) => {
        const example = details.example
        let [hbs, js] = example.split("->").map(x => x.trim())
        if (!js) {
          // The function has no return value
          return
        }

        // Trim 's
        js = js.replace(/^\'|\'$/g, "")
        let parsedExpected
        if ((parsedExpected = tryParseJson(js))) {
          if (Array.isArray(parsedExpected)) {
            if (typeof parsedExpected[0] === "object") {
              js = JSON.stringify(parsedExpected)
            } else {
              js = parsedExpected.join(",")
            }
          }
        }
        const requiresHbsBody = details.requiresBlock
        return [name, { hbs, js, requiresHbsBody }]
      })
      .filter(x => !!x)

    if (Object.keys(functions).length) {
      acc[collection] = functions
    }
    return acc
  }, {})

  return examples
}
module.exports.getParsedManifest = getParsedManifest

module.exports.runJsHelpersTests = (funcWrap = delegate => delegate()) => {
  const manifest = getParsedManifest()

  const processJS = (js, context) => {
    return funcWrap(() => processStringSync(encodeJSBinding(js), context))
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // $& means the whole matched string
  }

  describe("can be parsed and run as js", () => {
    const jsHelpers = getJsHelperList()
    const jsExamples = Object.keys(manifest).reduce((acc, v) => {
      acc[v] = manifest[v].filter(([key]) => jsHelpers[key])
      return acc
    }, {})

    describe.each(Object.keys(jsExamples))("%s", collection => {
      it.each(
        jsExamples[collection].filter(
          ([_, { requiresHbsBody }]) => !requiresHbsBody
        )
      )("%s", async (_, { hbs, js }) => {
        const context = {
          double: i => i * 2,
          isString: x => typeof x === "string",
        }

        const arrays = hbs.match(/\[[^/\]]+\]/)
        arrays?.forEach((arrayString, i) => {
          hbs = hbs.replace(new RegExp(escapeRegExp(arrayString)), `array${i}`)
          context[`array${i}`] = JSON.parse(arrayString.replace(/\'/g, '"'))
        })

        let convertedJs = convertToJS(hbs)

        let result = await processJS(convertedJs, context)
        result = result.replace(/&nbsp;/g, " ")
        expect(result).toEqual(js)
      })
    })
  })
}
