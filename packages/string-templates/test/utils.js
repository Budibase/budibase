const { getManifest } = require("../src")

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

module.exports.getParsedManifest = () => {
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
