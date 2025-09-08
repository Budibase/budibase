import {
  getDevWorkspaceID,
  getProdWorkspaceID,
  isDevWorkspaceID,
  isProdWorkspaceID,
} from "../../docIds/conversions"
import { generateWorkspaceID } from "../utils"

describe("utils", () => {
  describe("generateWorkspaceID", () => {
    function getID() {
      const workspaceId = generateWorkspaceID()
      const split = workspaceId.split("_")
      const uuid = split[split.length - 1]
      const devWorkspaceId = `app_dev_${uuid}`
      return { workspaceId, devWorkspaceId, split, uuid }
    }

    it("should be able to generate a new workspace ID", () => {
      expect(generateWorkspaceID().startsWith("app_")).toEqual(true)
    })

    it("should be able to convert a production workspace ID to development", () => {
      const { workspaceId, uuid } = getID()
      expect(getDevWorkspaceID(workspaceId)).toEqual(`app_dev_${uuid}`)
    })

    it("should be able to convert a development workspace ID to development", () => {
      const { devWorkspaceId, uuid } = getID()
      expect(getDevWorkspaceID(devWorkspaceId)).toEqual(`app_dev_${uuid}`)
    })

    it("should be able to convert a development ID to a production", () => {
      const { devWorkspaceId, uuid } = getID()
      expect(getProdWorkspaceID(devWorkspaceId)).toEqual(`app_${uuid}`)
    })

    it("should be able to convert a production ID to production", () => {
      const { workspaceId, uuid } = getID()
      expect(getProdWorkspaceID(workspaceId)).toEqual(`app_${uuid}`)
    })

    it("should be able to confirm dev workspace ID is development", () => {
      const { devWorkspaceId } = getID()
      expect(isDevWorkspaceID(devWorkspaceId)).toEqual(true)
    })

    it("should be able to confirm prod workspace ID is not development", () => {
      const { workspaceId } = getID()
      expect(isDevWorkspaceID(workspaceId)).toEqual(false)
    })

    it("should be able to confirm prod workspace ID is prod", () => {
      const { workspaceId } = getID()
      expect(isProdWorkspaceID(workspaceId)).toEqual(true)
    })

    it("should be able to confirm dev workspace ID is not prod", () => {
      const { devWorkspaceId } = getID()
      expect(isProdWorkspaceID(devWorkspaceId)).toEqual(false)
    })
  })
})
