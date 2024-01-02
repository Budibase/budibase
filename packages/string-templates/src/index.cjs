const templates = require("./index.js")

/**
 * CJS entrypoint for rollup
 */
module.exports.isValid = templates.isValid
module.exports.makePropSafe = templates.makePropSafe
module.exports.getManifest = templates.getManifest
module.exports.isJSBinding = templates.isJSBinding
module.exports.encodeJSBinding = templates.encodeJSBinding
module.exports.decodeJSBinding = templates.decodeJSBinding
module.exports.processStringSync = templates.processStringSync
module.exports.processObjectSync = templates.processObjectSync
module.exports.processString = templates.processString
module.exports.processObject = templates.processObject
module.exports.doesContainStrings = templates.doesContainStrings
module.exports.doesContainString = templates.doesContainString
module.exports.disableEscaping = templates.disableEscaping
module.exports.findHBSBlocks = templates.findHBSBlocks
module.exports.convertToJS = templates.convertToJS
module.exports.setJSRunner = templates.setJSRunner
module.exports.FIND_ANY_HBS_REGEX = templates.FIND_ANY_HBS_REGEX

if (!process.env.NO_JS) {
    const vm = require("vm")
    const { setJSRunner } = require("./helpers/javascript")
    /**
     * Use vm to run JS scripts in a browser Env
     */
    setJSRunner((js, context) => {
        context = {
            ...context,
            alert: undefined,
            setInterval: undefined,
            setTimeout: undefined,
        }
        vm.createContext(context)
        return vm.runInNewContext(js, context, {timeout: 1000})
    })
}