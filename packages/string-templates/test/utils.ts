import { getManifest } from "../src"
import { getJsHelperList } from "../src/helpers"

import { convertToJS, processStringSync, encodeJSBinding } from "../src/index"

function tryParseJson(str: string) {
  if (typeof str !== "string") {
    return
  }

  try {
    return JSON.parse(str.replace(/'/g, '"'))
  } catch (e) {
    // do nothing
  }
}

type ExampleType = [
  string,
  {
    hbs: string
    js: string
    requiresHbsBody: boolean
  }
]

export const getParsedManifest = () => {
  const manifest: any = getManifest()
  const collections = Object.keys(manifest)

  const examples = collections.reduce((acc, collection) => {
    const functions = Object.entries<{
      example: string
      requiresBlock: boolean
    }>(manifest[collection])
      .filter(
        ([, details]) =>
          details.example?.split("->").map(x => x.trim()).length > 1
      )
      .map(([name, details]): ExampleType => {
        const example = details.example
        let [hbs, js] = example.split("->").map(x => x.trim())

        // Trim 's
        js = js.replace(/^'|'$/g, "")
        let parsedExpected: string
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

    if (functions.length) {
      acc[collection] = functions
    }
    return acc
  }, {} as Record<string, ExampleType[]>)

  return examples
}

export const runJsHelpersTests = ({
  funcWrap,
  testsToSkip,
}: {
  funcWrap?: any
  testsToSkip?: any
} = {}) => {
  funcWrap = funcWrap || ((delegate: () => any) => delegate())
  const manifest = getParsedManifest()

  const processJS = (js: string, context: object | undefined) => {
    return funcWrap(() => processStringSync(encodeJSBinding(js), context))
  }

  function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // $& means the whole matched string
  }

  describe("can be parsed and run as js", () => {
    const jsHelpers = getJsHelperList()!
    const jsExamples = Object.keys(manifest).reduce((acc, v) => {
      acc[v] = manifest[v].filter(([key]) => jsHelpers[key])
      return acc
    }, {} as typeof manifest)

    describe.each(Object.keys(jsExamples))("%s", collection => {
      const examplesToRun = jsExamples[collection]
        .filter(([, { requiresHbsBody }]) => !requiresHbsBody)
        .filter(([key]) => !testsToSkip?.includes(key))

      examplesToRun.length &&
        it.each(examplesToRun)("%s", async (_, { hbs, js }) => {
          const context: any = {
            double: (i: number) => i * 2,
            isString: (x: any) => typeof x === "string",
          }

          const arrays = hbs.match(/\[[^/\]]+\]/)
          arrays?.forEach((arrayString, i) => {
            hbs = hbs.replace(
              new RegExp(escapeRegExp(arrayString)),
              `array${i}`
            )
            context[`array${i}`] = JSON.parse(arrayString.replace(/'/g, '"'))
          })

          let convertedJs = convertToJS(hbs)

          let result = await processJS(convertedJs, context)
          result = result.replace(/&nbsp;/g, " ")
          expect(result).toEqual(js)
        })
    })
  })
}
