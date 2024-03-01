import { utils } from "@budibase/shared-core"
import environment from "../../environment"
import fs from "fs"

export const enum BundleType {
  HELPERS = "helpers",
  BSON = "bson",
  SNIPPETS = "snippets",
}

const bundleSourceFile: Record<BundleType, string> = {
  [BundleType.HELPERS]: "./index-helpers.ivm.bundle.js",
  [BundleType.BSON]: "./bson.ivm.bundle.js",
  [BundleType.SNIPPETS]: "./snippets.ivm.bundle.js",
}
const bundleSourceCode: Partial<Record<BundleType, string>> = {}

export function loadBundle(type: BundleType) {
  let sourceCode = bundleSourceCode[type]
  if (sourceCode) {
    return sourceCode
  }

  sourceCode = fs.readFileSync(require.resolve(bundleSourceFile[type]), "utf-8")
  bundleSourceCode[type] = sourceCode
  return sourceCode
}
