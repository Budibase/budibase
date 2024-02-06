import { utils } from "@budibase/shared-core"
import environment from "../../environment"
import fs from "fs"

export const enum BundleType {
  HELPERS = "helpers",
  BSON = "bson",
}

const bundleSourceCode = {
  [BundleType.HELPERS]: "../bundles/index-helpers.ivm.bundle.js",
  [BundleType.BSON]: "../bundles/bson.ivm.bundle.js",
}

export function loadBundle(type: BundleType) {
  if (environment.isJest()) {
    return fs.readFileSync(require.resolve(bundleSourceCode[type]), "utf-8")
  }

  switch (type) {
    case BundleType.HELPERS:
      return require("../bundles/index-helpers.ivm.bundle.js")
    case BundleType.BSON:
      return require("../bundles/bson.ivm.bundle.js")
    default:
      utils.unreachable(type)
  }
}
