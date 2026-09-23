import { getDevWorkspaceID, getProdWorkspaceID } from "./workspaces"

describe("workspace IDs", () => {
  describe("getDevWorkspaceID", () => {
    it("converts a production workspace ID", () => {
      expect(getDevWorkspaceID("app_workspace")).toBe("app_dev_workspace")
    })

    it("leaves a development workspace ID unchanged", () => {
      expect(getDevWorkspaceID("app_dev_workspace")).toBe("app_dev_workspace")
    })

    it("preserves workspace prefixes in the ID body", () => {
      expect(getDevWorkspaceID("app_workspace_app_section")).toBe(
        "app_dev_workspace_app_section"
      )
    })

    it("rejects an empty workspace ID", () => {
      expect(() => getDevWorkspaceID("")).toThrow("No workspace ID provided")
    })
  })

  describe("getProdWorkspaceID", () => {
    it("converts a development workspace ID", () => {
      expect(getProdWorkspaceID("app_dev_workspace")).toBe("app_workspace")
    })

    it("leaves a production workspace ID unchanged", () => {
      expect(getProdWorkspaceID("app_workspace")).toBe("app_workspace")
    })

    it("preserves development prefixes in the ID body", () => {
      expect(getProdWorkspaceID("app_dev_workspace_app_dev_section")).toBe(
        "app_workspace_app_dev_section"
      )
    })

    it("rejects an empty workspace ID", () => {
      expect(() => getProdWorkspaceID("")).toThrow("No workspace ID provided")
    })
  })
})
