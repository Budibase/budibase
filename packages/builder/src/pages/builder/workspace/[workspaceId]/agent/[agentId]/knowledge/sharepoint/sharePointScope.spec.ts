import { SharePointScopeTargetType } from "@budibase/types"
import { entryToNode, isNodeTargeted, toggleScopeNode } from "./sharePointScope"

describe("SharePoint scope selection", () => {
  const folder = entryToNode({
    id: "drive-1:folder-1",
    name: "Policies",
    path: "Documents/Policies",
    type: "folder",
    driveId: "drive-1",
    itemId: "folder-1",
    hasChildren: true,
  })

  it("adds and removes an explicit target", () => {
    const targets = toggleScopeNode({
      targets: [],
      node: folder,
      nextSelected: true,
    })

    expect(targets).toEqual([
      {
        type: SharePointScopeTargetType.FOLDER,
        driveId: "drive-1",
        itemId: "folder-1",
      },
    ])
    expect(isNodeTargeted(folder, targets)).toBe(true)
    expect(
      toggleScopeNode({
        targets,
        node: folder,
        nextSelected: false,
      })
    ).toEqual([])
  })

  it("does not duplicate an existing target", () => {
    const targets = toggleScopeNode({
      targets: [],
      node: folder,
      nextSelected: true,
    })

    expect(
      toggleScopeNode({
        targets,
        node: folder,
        nextSelected: true,
      })
    ).toEqual(targets)
  })
})
