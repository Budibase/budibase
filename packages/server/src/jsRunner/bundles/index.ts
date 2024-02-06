import { utils } from "@budibase/shared-core"
import environment from "../../environment"
import fs from "fs"

export enum BundleType {
  HELPERS = "helpers",
}

const bundleSourceCode = {
  [BundleType.HELPERS]: "../bundles/index-helpers.ivm.bundle.js",
}

export function loadBundle(type: BundleType) {
  if (environment.isJest()) {
    return fs.readFileSync(require.resolve(bundleSourceCode[type]), "utf-8")
  }

  switch (type) {
    case BundleType.HELPERS:
      return require("../bundles/index-helpers.ivm.bundle.js")
    default:
      utils.unreachable(type)
  }
}
