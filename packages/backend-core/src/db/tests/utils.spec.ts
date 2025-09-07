import {
  getDevWorkspaceID,
  getProdAppID,
  isDevWorkspaceID,
  isProdWorkspaceID,
} from "../../docIds/conversions"
import { generateAppID } from "../utils"

describe("utils", () => {
  describe("generateAppID", () => {
    function getID() {
      const appId = generateAppID()
      const split = appId.split("_")
      const uuid = split[split.length - 1]
      const devAppId = `app_dev_${uuid}`
      return { appId, devAppId, split, uuid }
    }

    it("should be able to generate a new app ID", () => {
      expect(generateAppID().startsWith("app_")).toEqual(true)
    })

    it("should be able to convert a production app ID to development", () => {
      const { appId, uuid } = getID()
      expect(getDevWorkspaceID(appId)).toEqual(`app_dev_${uuid}`)
    })

    it("should be able to convert a development app ID to development", () => {
      const { devAppId, uuid } = getID()
      expect(getDevWorkspaceID(devAppId)).toEqual(`app_dev_${uuid}`)
    })

    it("should be able to convert a development ID to a production", () => {
      const { devAppId, uuid } = getID()
      expect(getProdAppID(devAppId)).toEqual(`app_${uuid}`)
    })

    it("should be able to convert a production ID to production", () => {
      const { appId, uuid } = getID()
      expect(getProdAppID(appId)).toEqual(`app_${uuid}`)
    })

    it("should be able to confirm dev app ID is development", () => {
      const { devAppId } = getID()
      expect(isDevWorkspaceID(devAppId)).toEqual(true)
    })

    it("should be able to confirm prod app ID is not development", () => {
      const { appId } = getID()
      expect(isDevWorkspaceID(appId)).toEqual(false)
    })

    it("should be able to confirm prod app ID is prod", () => {
      const { appId } = getID()
      expect(isProdWorkspaceID(appId)).toEqual(true)
    })

    it("should be able to confirm dev app ID is not prod", () => {
      const { devAppId } = getID()
      expect(isProdWorkspaceID(devAppId)).toEqual(false)
    })
  })
})
