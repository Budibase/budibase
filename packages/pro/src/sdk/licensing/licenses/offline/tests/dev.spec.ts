jest.mock("../signing")

import * as _signing from "../signing"
import * as dev from "../dev"
import { structures, generator } from "@budibase/backend-core/tests"

const signing = jest.mocked(_signing, { shallow: false })

describe("dev", () => {
  afterEach(() => {
    dev.deleteDevLicense()
  })

  it("returns undefined when no license exists", () => {
    const license = dev.getOfflineLicense()
    expect(license).toBeUndefined()
  })

  it("returns license when it exists", () => {
    const offlineLicense = structures.licenses.offlineLicense()
    const licenseToken = generator.string()
    dev.writeDevLicenseToDisk(licenseToken)
    signing.verifyLicenseToken.mockReturnValueOnce(offlineLicense)
    const license = dev.getOfflineLicense()
    expect(license).toEqual(offlineLicense)
  })

  it("returns undefined when there is an error", () => {
    dev.writeDevLicenseToDisk("license")
    signing.verifyLicenseToken.mockImplementation(() => {
      throw new Error()
    })
    const license = dev.getOfflineLicense()
    expect(license).toBe(undefined)
  })
})
