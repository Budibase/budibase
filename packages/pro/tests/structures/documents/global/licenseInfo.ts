import { structures, generator } from "@budibase/backend-core/tests"
// don't shorten
import { LicenseInfo } from "../../../../src/types"

export function tokenBased(): LicenseInfo {
  return {
    _id: structures.db.id(),
    _rev: structures.db.rev(),
    offlineLicenseToken: generator.string(),
  }
}

export function keyBased(): LicenseInfo {
  return {
    _id: structures.db.id(),
    _rev: structures.db.rev(),
    licenseKey: generator.string(),
  }
}
