import { utils } from "@budibase/shared-core"
import environment from "../../environment"
import fs from "fs"

export const enum BundleType {
  HELPERS = "helpers",
  BSON = "bson",
}

const bundleSourceCode: Partial<Record<BundleType, string>> = {}

export function loadBundle(type: BundleType) {
  let sourceCode = bundleSourceCode[type]
  if (sourceCode) {
    return sourceCode
  }

  if (!environment.isBundled) {
    let filePath
    switch (type) {
      case BundleType.HELPERS:
        filePath = "./index-helpers.ivm.bundle.js"
        break
      case BundleType.BSON:
        filePath = "./bson.ivm.bundle.js"
        break
      default:
        throw utils.unreachable(type)
    }

    sourceCode = fs.readFileSync(require.resolve(filePath), "utf-8")
  } else {
    // If we are running from a built version, esbuild is configured to inject .ivm.bundle.js files as text
    switch (type) {
      case BundleType.HELPERS:
        sourceCode = require("./index-helpers.ivm.bundle.js")
        break
      case BundleType.BSON:
        sourceCode = require("./bson.ivm.bundle.js")
        break
      default:
        throw utils.unreachable(type)
    }
  }
  bundleSourceCode[type] = sourceCode

  return sourceCode
}
