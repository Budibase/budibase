import { utils } from "@budibase/shared-core"
import environment from "../../environment"
import fs from "fs"

export const enum BundleType {
  HELPERS = "helpers",
  BSON = "bson",
}

const bundleSourceCode = {
  [BundleType.HELPERS]: "./index-helpers.ivm.bundle.js",
  [BundleType.BSON]: "./bson.ivm.bundle.js",
}

export function loadBundle(type: BundleType) {
  if (!environment.isBundled) {
    return fs.readFileSync(require.resolve(bundleSourceCode[type]), "utf-8")
  }

  // If we are running from a built version, esbuild is configured to inject .ivm.bundle.js files as text
  switch (type) {
    case BundleType.HELPERS:
      return require("./index-helpers.ivm.bundle.js")
    case BundleType.BSON:
      return require("./bson.ivm.bundle.js")
    default:
      utils.unreachable(type)
  }
}
