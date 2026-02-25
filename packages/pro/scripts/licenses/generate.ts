import * as pro from "../../src"
import { Feature, License, PlanType } from "@budibase/types"
import jwt from "jsonwebtoken"
import fs from "fs"
import { join } from "path"

const privateKeyPath = join(
  process.cwd(),
  "../../../account-portal/packages/server/offline-keys/private_key.pem"
)
const PRIVATE_KEY = fs.readFileSync(privateKeyPath)

const DEVELOPER_LICENSE: License = {
  ...pro.constants.licenses.UNLIMITED_LICENSE,
  features: Object.values(Feature) as Feature[],
}

function generate(planType: PlanType) {
  const license = DEVELOPER_LICENSE
  license.plan.type = planType

  const signedLicense = jwt.sign(license, PRIVATE_KEY, {
    encoding: "utf-8",
    algorithm: "RS256",
  })

  pro.licensing.offline.dev.writeDevLicenseToDisk(signedLicense)
}

// e.g. free, pro, team, business, enterprise
const planType = process.argv[2]

if (!planType) {
  throw new Error("plan type required")
}

if (planType === PlanType.FREE) {
  pro.licensing.offline.dev.deleteDevLicense()
} else {
  generate(planType as PlanType)
}
