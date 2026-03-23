jest.mock("../signing")
jest.mock("../../../../../db")
jest.mock("../../../cache")
jest.mock("../../../../utils")
jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  const mocked = jest.createMockFromModule<typeof actual>(
    "@budibase/backend-core"
  )
  return {
    __esModule: true, // Preserve the module structure
    ...mocked,
    Duration: actual.Duration,
  }
})
jest.mock("../../features")
jest.mock("../../quotas")

import * as offline from "../offline"
import { generator, structures } from "../../../../../../tests"
import {
  Feature,
  Installation,
  OfflineIdentifier,
  OfflineLicense,
} from "@budibase/types"
import * as _signing from "../signing"
import * as _db from "../../../../../db"
import * as _cache from "../../../cache"
import * as _utils from "../../../../utils"
import * as _core from "@budibase/backend-core"
import { LicenseInfo } from "../../../../../types"
import * as _features from "../../features"
import * as _quotas from "../../quotas"
import _ from "lodash"

const signing = jest.mocked(_signing, { shallow: false })
const db = jest.mocked(_db, { shallow: false })
const cache = jest.mocked(_cache, { shallow: false })
const utils = jest.mocked(_utils, { shallow: false })
const core = jest.mocked(_core, { shallow: false })
const context = core.context
const events = core.events
const installation = core.installation
const features = jest.mocked(_features)
const quotas = jest.mocked(_quotas)

describe("offline", () => {
  let licenseInfo: LicenseInfo
  let install: Installation
  let installId: string
  let tenantId: string
  let offlineLicense: OfflineLicense
  let identifier: OfflineIdentifier

  function setupIdentifierMocks() {
    installation.getInstall.mockResolvedValue(install)
    context.getTenantId.mockReturnValue(tenantId)
    events.identification.getUniqueTenantId.mockResolvedValue(tenantId)
  }

  beforeEach(() => {
    jest.resetAllMocks()
    licenseInfo = structures.docs.licenseInfo.tokenBased()
    install = structures.docs.installation.install()
    installId = install.installId
    tenantId = generator.string()
    offlineLicense = structures.licenses.offlineLicense()
    identifier = structures.licenses.offlineIdentifier(installId, tenantId)
    offlineLicense.identifier = identifier
  })

  describe("activateOfflineLicense", () => {
    it("activates license", async () => {
      const token = "token"
      await offline.activateOfflineLicenseToken(token)
      expect(db.licenseInfo.save).toHaveBeenCalledWith({
        offlineLicenseToken: token,
      })
      expect(cache.refresh).toHaveBeenCalledTimes(1)
    })
  })

  describe("deleteOfflineLicenseToken", () => {
    it("deletes license", async () => {
      await offline.deleteOfflineLicenseToken()
      expect(db.licenseInfo.save).toHaveBeenCalledWith({
        offlineLicenseToken: undefined,
      })
      expect(cache.refresh).toHaveBeenCalledTimes(1)
    })
  })

  describe("getOfflineLicenseToken", () => {
    it("returns token", async () => {
      const licenseInfo = structures.docs.licenseInfo.tokenBased()
      db.licenseInfo.get.mockResolvedValue(licenseInfo)
      const token = await offline.getOfflineLicenseToken()
      expect(token).toBe(licenseInfo.offlineLicenseToken)
    })
  })

  describe("getOfflineLicense", () => {
    it("returns license from token", async () => {
      db.licenseInfo.get.mockResolvedValue(licenseInfo)
      signing.verifyLicenseToken.mockReturnValue(offlineLicense)
      setupIdentifierMocks()
      const license = await offline.getOfflineLicense()
      expect(license).toBe(offlineLicense)
    })

    it("returns undefined when there is no token", async () => {
      const license = await offline.getOfflineLicense()
      expect(license).toBe(undefined)
    })

    it("returns undefined when there is an error", async () => {
      const licenseInfo = structures.docs.licenseInfo.tokenBased()
      db.licenseInfo.get.mockResolvedValue(licenseInfo)
      signing.verifyLicenseToken.mockImplementation(() => {
        throw new Error()
      })
      const license = await offline.getOfflineLicense()
      expect(license).toBe(undefined)
    })
  })

  describe("identifier", () => {
    describe("getIdentifier", () => {
      it("returns identifier", async () => {
        setupIdentifierMocks()
        const result = await offline.getIdentifier()
        expect(result).toEqual(identifier)
      })
    })

    describe("getIdentifierBase64", () => {
      it("returns base64 encoded identifier", async () => {
        setupIdentifierMocks()
        utils.encoding.objectToBase64.mockReturnValue("base64")
        const base64 = await offline.getIdentifierBase64()
        expect(base64).toBe("base64")
        expect(utils.encoding.objectToBase64).toHaveBeenCalledWith(identifier)
      })
    })
  })

  describe("verifyExpiry", () => {
    it("throws when expiry exceeded", () => {
      const expireAt = new Date(Date.now() + -1).toISOString()
      offlineLicense.expireAt = expireAt
      expect(() => offline.verifyExpiry(offlineLicense)).toThrow(
        new Error(`Offline license has expired. expireAt=${expireAt}`)
      )
    })
  })

  describe("verifyInstallation", () => {
    it("throws when installId does not match license", async () => {
      setupIdentifierMocks()
      offlineLicense.identifier.installId = generator.string()
      await expect(offline.verifyInstallation(offlineLicense)).rejects.toThrow(
        new Error("Invalid offline license")
      )
    })
    it("throws when tenantId does not match license", async () => {
      setupIdentifierMocks()
      offlineLicense.identifier.tenantId = generator.string()
      await expect(offline.verifyInstallation(offlineLicense)).rejects.toThrow(
        new Error("Invalid offline license")
      )
    })
  })

  describe("erich", () => {
    it("enriches features", () => {
      features.getOfflineFeatures.mockReturnValue([Feature.ENFORCEABLE_SSO])
      offlineLicense.features = [Feature.OFFLINE]
      offlineLicense = offline.enrichLicense(offlineLicense)
      expect(offlineLicense.features).toEqual([
        Feature.OFFLINE,
        Feature.ENFORCEABLE_SSO,
      ])
    })

    it("enriches quotas", () => {
      const licenseQuotas = offlineLicense.quotas
      const newQuotas = _.clone(licenseQuotas)
      // something has been changed in latest
      newQuotas.usage.static.rows.value = 10
      // something extra in offline not in latest
      // @ts-ignore
      delete newQuotas.usage.static.apps
      quotas.getQuotas.mockReturnValue(newQuotas)

      offlineLicense = offline.enrichLicense(offlineLicense)

      let expected = _.clone(newQuotas)
      // extra field in offline has been retained
      expected.usage.static.apps = licenseQuotas.usage.static.apps
      expect(offlineLicense.quotas).toEqual(expected)
    })
  })
})
