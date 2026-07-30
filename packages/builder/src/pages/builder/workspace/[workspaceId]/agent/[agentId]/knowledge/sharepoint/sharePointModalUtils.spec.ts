import { KnowledgeBaseFileStatus } from "@budibase/types"
import { buildEntryTree } from "./sharePointModalUtils"

describe("buildEntryTree", () => {
  it("groups synced files by their SharePoint path", () => {
    expect(
      buildEntryTree([
        {
          filename: "handbook.txt",
          sourcePath: "Documents/Policies/handbook.txt",
          status: KnowledgeBaseFileStatus.READY,
        },
      ])
    ).toEqual([
      expect.objectContaining({
        name: "Documents",
        type: "folder",
        children: [
          expect.objectContaining({
            name: "Policies",
            children: [
              expect.objectContaining({
                name: "handbook.txt",
                type: "file",
                status: KnowledgeBaseFileStatus.READY,
              }),
            ],
          }),
        ],
      }),
    ])
  })

  it("falls back to the filename when no source path is stored", () => {
    expect(buildEntryTree([{ filename: "notes.txt" }])).toEqual([
      expect.objectContaining({
        name: "notes.txt",
        type: "file",
      }),
    ])
  })
})
