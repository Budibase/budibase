import { Feature, type License, PlanType } from "@budibase/types"
import jwt from "jsonwebtoken"
import fs from "fs"
import { join } from "path"
import { tmpdir } from "os"
import { UNLIMITED_LICENSE } from "../../src/constants/licenses"

const licenseDirectory = join(tmpdir(), ".budibase")
const licensePath = join(licenseDirectory, "dev_license.txt")

const privateKeyPath = join(
  process.cwd(),
  "../../../account-portal/packages/server/offline-keys/private_key.pem"
)

const DEVELOPER_LICENSE: License = {
  ...UNLIMITED_LICENSE,
  features: Object.values(Feature) as Feature[],
}

function generate(planType: PlanType) {
  const license = DEVELOPER_LICENSE
  license.plan.type = planType

  const signedLicense = jwt.sign(license, fs.readFileSync(privateKeyPath), {
    encoding: "utf-8",
    algorithm: "RS256",
  })

  fs.mkdirSync(licenseDirectory, { recursive: true })
  fs.writeFileSync(licensePath, signedLicense, { encoding: "utf-8" })
  console.log(`Writing license to: ${licensePath}`)
}

// e.g. free, pro, team, business, enterprise
const planType = process.argv[2]

if (!planType) {
  throw new Error("plan type required")
}

if (planType === PlanType.FREE) {
  fs.rmSync(licensePath, { force: true })
} else {
  generate(planType as PlanType)
}
