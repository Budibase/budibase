import {
  SharePointScopeAction,
  SharePointScopeTargetType,
  type SharePointScopeRule,
} from "@budibase/types"
import { entryToNode, toggleScopeNode } from "./sharePointScope"

describe("SharePoint scope selection", () => {
  const drive = entryToNode({
    id: "drive:drive-1",
    name: "Documents",
    path: "Documents",
    type: "drive",
    driveId: "drive-1",
    hasChildren: true,
  })
  const folder = entryToNode({
    id: "drive-1:folder-1",
    name: "Policies",
    path: "Documents/Policies",
    type: "folder",
    driveId: "drive-1",
    itemId: "folder-1",
    hasChildren: true,
  })
  const file = entryToNode({
    id: "drive-1:file-1",
    name: "handbook.txt",
    path: "Documents/Policies/handbook.txt",
    type: "file",
    driveId: "drive-1",
    itemId: "file-1",
  })

  it("creates a recursive folder inclusion beneath an excluded parent", () => {
    expect(
      toggleScopeNode({
        rules: [],
        node: folder,
        nextSelected: true,
        inheritedAction: SharePointScopeAction.EXCLUDE,
      })
    ).toEqual([
      {
        action: SharePointScopeAction.INCLUDE,
        target: expect.objectContaining({
          type: SharePointScopeTargetType.FOLDER,
          itemId: "folder-1",
        }),
      },
    ])
  })

  it("creates a file exclusion beneath an included folder", () => {
    expect(
      toggleScopeNode({
        rules: [],
        node: file,
        nextSelected: false,
        inheritedAction: SharePointScopeAction.INCLUDE,
      })
    ).toEqual([
      {
        action: SharePointScopeAction.EXCLUDE,
        target: expect.objectContaining({
          type: SharePointScopeTargetType.FILE,
          itemId: "file-1",
        }),
      },
    ])
  })

  it("removes descendant rules when a drive is toggled", () => {
    const descendantRule: SharePointScopeRule = {
      action: SharePointScopeAction.EXCLUDE,
      target: {
        type: SharePointScopeTargetType.FILE,
        driveId: "drive-1",
        itemId: "file-1",
        name: "handbook.txt",
        path: "Documents/Policies/handbook.txt",
      },
    }
    expect(
      toggleScopeNode({
        rules: [descendantRule],
        node: drive,
        nextSelected: true,
        inheritedAction: SharePointScopeAction.INCLUDE,
      })
    ).toEqual([])
  })
})
