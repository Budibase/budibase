jest.mock("../client")
jest.mock("../offline")

import * as licenses from "../licenses"
import { structures } from "@budibase/backend-core/tests"
import { licenses as constants } from "../../../../constants"
import { env, isOfflineMode } from "@budibase/backend-core"
import * as _client from "../client"
import * as _offline from "../offline"

const client = jest.mocked(_client, { shallow: false })
const offline = jest.mocked(_offline, { shallow: false })

describe("licenses", () => {
  beforeEach(() => {
    jest.resetAllMocks()
    env._set("OFFLINE_MODE", undefined)
    env._set("NODE_ENV", "production")
  })
  describe("getFreeLicense", () => {
    it("returns self free license", () => {
      env._set("SELF_HOSTED", true)
      const license = licenses.getFreeLicense()
      expect(license).toEqual(constants.SELF_FREE_LICENSE)
    })

    it("returns cloud free license", () => {
      env._set("SELF_HOSTED", false)
      const license = licenses.getFreeLicense()
      expect(license).toEqual(constants.CLOUD_FREE_LICENSE)
    })
  })

  describe("getLicense", () => {
    describe("prod", () => {
      it("returns license from client", async () => {
        const clientLicense = structures.licenses.license()
        client.getLicense.mockResolvedValue(clientLicense)
        const license = await licenses.getLicense()
        expect(license).toEqual(clientLicense)
        expect(offline.dev.getOfflineLicense).not.toHaveBeenCalled()
        expect(offline.getOfflineLicense).not.toHaveBeenCalled()
      })

      it("treats the string zero as online mode", async () => {
        env._set("OFFLINE_MODE", "0")
        const clientLicense = structures.licenses.license()
        client.getLicense.mockResolvedValue(clientLicense)

        const license = await licenses.getLicense()

        expect(license).toEqual(clientLicense)
        expect(client.getLicense).toHaveBeenCalled()
        expect(offline.getOfflineLicense).not.toHaveBeenCalled()
      })

      it.each([
        ["true", true],
        ["TRUE", true],
        [" 1 ", true],
        [" yes ", true],
        ["on", true],
        ["false", false],
        [" 0 ", false],
        [undefined, false],
      ])("parses OFFLINE_MODE=%s as %s", (value, expected) => {
        env._set("OFFLINE_MODE", value)
        expect(isOfflineMode()).toBe(expected)
      })
    })
    describe("offline", () => {
      it.each(["1", "true", "TRUE"])(
        "returns offline license for OFFLINE_MODE=%s",
        async offlineMode => {
          env._set("OFFLINE_MODE", offlineMode)
          const offlineLicense = structures.licenses.offlineLicense()
          offline.getOfflineLicense.mockResolvedValue(offlineLicense)
          const license = await licenses.getLicense()
          expect(license).toEqual(offlineLicense)
          expect(client.getLicense).not.toHaveBeenCalled()
          expect(offline.dev.getOfflineLicense).not.toHaveBeenCalled()
        }
      )
    })
    describe("dev", () => {
      beforeEach(() => {
        env._set("NODE_ENV", "dev")
      })
      it("returns dev license", async () => {
        const devLicense = structures.licenses.license()
        offline.dev.getOfflineLicense.mockReturnValue(devLicense)
        const license = await licenses.getLicense()
        expect(license).toEqual(devLicense)
        expect(offline.getOfflineLicense).not.toHaveBeenCalled()
      })
    })
  })
})
