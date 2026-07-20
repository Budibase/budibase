import { buildSharePointDriveFilterPath } from "../sharepoint"

describe("SharePoint filter paths", () => {
  it("builds stable drive roots and file paths", () => {
    expect(buildSharePointDriveFilterPath("b!drive-1")).toBe("drive:b!drive-1")
    expect(
      buildSharePointDriveFilterPath(
        "drive/with/slashes",
        "Policies/handbook.txt"
      )
    ).toBe("drive:drive%2Fwith%2Fslashes/Policies/handbook.txt")
  })
})
