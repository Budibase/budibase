jest.mock("../client")
jest.mock("../offline")

import * as licenses from "../licenses"
import { structures } from "@budibase/backend-core/tests"
import { licenses as constants } from "../../../../constants"
import { env } from "@budibase/backend-core"
import * as _client from "../client"
import * as _offline from "../offline"

const client = jest.mocked(_client, { shallow: false })
const offline = jest.mocked(_offline, { shallow: false })

describe("licenses", () => {
  beforeEach(() => {
    jest.resetAllMocks()
    env._set("OFFLINE_MODE", 0)
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
    })
    describe("offline", () => {
      beforeEach(() => {
        env._set("OFFLINE_MODE", 1)
      })
      it("returns offline license", async () => {
        const offlineLicense = structures.licenses.offlineLicense()
        offline.getOfflineLicense.mockResolvedValue(offlineLicense)
        const license = await licenses.getLicense()
        expect(license).toEqual(offlineLicense)
        expect(client.getLicense).not.toHaveBeenCalled()
        expect(offline.dev.getOfflineLicense).not.toHaveBeenCalled()
      })
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
