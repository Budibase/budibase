import { describe, expect, it } from "vitest"
import { KnowledgeBaseFileStatus } from "@budibase/types"
import {
  buildEntryTree,
  buildEntryTreeFromSourceEntries,
  buildPatternsFromSelection,
  flattenNodesByPath,
  isExcludeNewByDefaultPatterns,
  matchesConfiguredPatterns,
  rehydrateFromPatterns,
  SITE_ROOT_PATH,
  wrapSelectionTreeWithSiteRoot,
} from "./sharePointModalUtils"

describe("sharePointModalUtils.buildEntryTree", () => {
  it("builds a nested tree from source paths", () => {
    const tree = buildEntryTree([
      {
        filename: "ignored.txt",
        sourcePath: "docs/guides/intro.md",
        status: KnowledgeBaseFileStatus.READY,
      },
      {
        filename: "ignored-2.txt",
        sourcePath: "docs/api/reference.md",
        status: KnowledgeBaseFileStatus.PROCESSING,
      },
    ])

    expect(tree).toHaveLength(1)
    expect(tree[0].type).toBe("folder")
    expect(tree[0].path).toBe("docs")

    const docsChildren = tree[0].children
    expect(docsChildren.map(node => node.path)).toEqual([
      "docs/api",
      "docs/guides",
    ])
    expect(docsChildren[0].children[0]).toMatchObject({
      path: "docs/api/reference.md",
      type: "file",
      status: KnowledgeBaseFileStatus.PROCESSING,
    })
    expect(docsChildren[1].children[0]).toMatchObject({
      path: "docs/guides/intro.md",
      type: "file",
      status: KnowledgeBaseFileStatus.READY,
    })
  })

  it("updates leaf metadata when the same path appears again", () => {
    const tree = buildEntryTree([
      {
        filename: "same-file.md",
        sourcePath: "root/same-file.md",
        status: KnowledgeBaseFileStatus.PROCESSING,
      },
      {
        filename: "same-file.md",
        sourcePath: "root/same-file.md",
        status: KnowledgeBaseFileStatus.FAILED,
        errorMessage: "parse failed",
      },
    ])

    const fileNode = tree[0].children[0]
    expect(fileNode).toMatchObject({
      path: "root/same-file.md",
      type: "file",
      status: KnowledgeBaseFileStatus.FAILED,
      errorMessage: "parse failed",
    })
  })

  it("uses filename when sourcePath is not provided and ignores empty paths", () => {
    const tree = buildEntryTree([
      {
        filename: "loose.txt",
        status: KnowledgeBaseFileStatus.READY,
      },
      {
        filename: "",
        sourcePath: "",
      },
    ])

    expect(tree).toHaveLength(1)
    expect(tree[0]).toMatchObject({
      path: "loose.txt",
      type: "file",
      status: KnowledgeBaseFileStatus.READY,
    })
  })

  it("sorts folders before files and names alphabetically", () => {
    const tree = buildEntryTree([
      { filename: "z.txt" },
      { filename: "alpha/b.txt" },
      { filename: "alpha/a.txt" },
      { filename: "a.txt" },
    ])

    expect(tree.map(node => node.path)).toEqual(["alpha", "a.txt", "z.txt"])
    expect(tree[0].children.map(node => node.path)).toEqual([
      "alpha/a.txt",
      "alpha/b.txt",
    ])
  })
})

describe("sharePointModalUtils.buildEntryTreeFromSourceEntries", () => {
  it("groups files and lists into separate branches with stable list IDs", () => {
    const tree = buildEntryTreeFromSourceEntries([
      {
        id: "drive:item",
        name: "guide.md",
        path: "docs/guide.md",
        type: "file",
      },
      {
        id: "list-123",
        name: "FAQs",
        path: "FAQs",
        type: "list",
      },
    ])

    expect(tree.map(node => node.name)).toEqual(["Files", "Lists"])
    expect(tree[0].children[0].children[0]).toMatchObject({
      name: "guide.md",
      type: "file",
    })
    expect(tree[1].children[0]).toMatchObject({
      id: "list-123",
      name: "FAQs",
      path: "__list__:list-123",
      type: "list",
    })
  })

  it("keeps list paths distinct from colliding drive paths", () => {
    const tree = wrapSelectionTreeWithSiteRoot(
      buildEntryTreeFromSourceEntries([
        {
          id: "drive:item",
          name: "list-123",
          path: "__list__/list-123",
          type: "file",
        },
        {
          id: "list-123",
          name: "FAQs",
          path: "FAQs",
          type: "list",
        },
      ])
    )
    const nodesByPath = flattenNodesByPath(tree)

    expect(nodesByPath.get("__list__/list-123")?.type).toBe("file")
    expect(nodesByPath.get("__list__:list-123")?.type).toBe("list")
  })
})

describe("sharePointModalUtils filter patterns", () => {
  const getSelectionFixture = () => {
    const selectionTree = wrapSelectionTreeWithSiteRoot(
      buildEntryTreeFromSourceEntries([
        {
          id: "drive:item",
          name: "guide.md",
          path: "docs/guide.md",
          type: "file",
        },
        {
          id: "list-123",
          name: "FAQs",
          path: "FAQs",
          type: "list",
        },
      ])
    )
    return {
      selectionNodeByPath: flattenNodesByPath(selectionTree),
      selectablePaths: ["docs/guide.md", "__list__:list-123"],
    }
  }

  it("treats !** as exclude-all (including nested paths)", () => {
    expect(matchesConfiguredPatterns("activities.txt", ["!**"])).toBe(false)
    expect(matchesConfiguredPatterns("folder 1/sub 1/file.pdf", ["!**"])).toBe(
      false
    )
  })

  it("recognizes exclude-new-by-default for !**", () => {
    expect(isExcludeNewByDefaultPatterns(["!**"])).toBe(true)
  })

  it("rehydrates exclude-all with both files and lists unselected", () => {
    const { selectablePaths } = getSelectionFixture()

    expect(rehydrateFromPatterns(["!**"], selectablePaths)).toEqual([])
  })

  it("uses exact list paths when excluding new content by default", () => {
    const { selectablePaths, selectionNodeByPath } = getSelectionFixture()
    const patterns = buildPatternsFromSelection(
      ["__list__:list-123"],
      selectablePaths,
      selectionNodeByPath,
      false
    )

    expect(patterns).toEqual(["!**", "__list__:list-123"])
    expect(rehydrateFromPatterns(patterns || [], selectablePaths)).toEqual([
      "__list__:list-123",
    ])
  })

  it("uses exact negated list paths when including new content by default", () => {
    const { selectablePaths, selectionNodeByPath } = getSelectionFixture()
    const patterns = buildPatternsFromSelection(
      ["docs/guide.md"],
      selectablePaths,
      selectionNodeByPath,
      true
    )

    expect(patterns).toEqual(["!__list__:list-123"])
    expect(rehydrateFromPatterns(patterns || [], selectablePaths)).toEqual([
      "docs/guide.md",
    ])
  })

  it("omits patterns when all files and lists are selected by default", () => {
    const { selectablePaths, selectionNodeByPath } = getSelectionFixture()

    expect(
      buildPatternsFromSelection(
        [SITE_ROOT_PATH, ...selectablePaths],
        selectablePaths,
        selectionNodeByPath,
        true
      )
    ).toBeUndefined()
  })
})

describe("sharePointModalUtils document library entries", () => {
  it("groups identical relative paths beneath their document libraries", () => {
    const tree = buildEntryTreeFromSourceEntries([
      {
        id: "drive-1",
        name: "Documents",
        path: "Documents",
        type: "folder",
      },
      {
        id: "drive-1:item-1",
        name: "handbook.txt",
        path: "Documents/Policies/handbook.txt",
        type: "file",
      },
      {
        id: "drive-2:item-1",
        name: "handbook.txt",
        path: "Department Files/Policies/handbook.txt",
        type: "file",
      },
    ])

    expect(tree.map(node => node.name)).toEqual(["Files"])
    const documentLibraries = tree[0].children
    expect(documentLibraries.map(node => node.name)).toEqual([
      "Department Files",
      "Documents",
    ])
    expect(documentLibraries.map(node => node.path)).toEqual([
      "Department Files",
      "Documents",
    ])
    expect(documentLibraries[0].children[0].children[0]).toMatchObject({
      name: "handbook.txt",
      path: "Department Files/Policies/handbook.txt",
    })
    expect(documentLibraries[1].children[0].children[0]).toMatchObject({
      name: "handbook.txt",
      path: "Documents/Policies/handbook.txt",
    })
  })

  it("keeps an empty document library in the tree", () => {
    expect(
      buildEntryTreeFromSourceEntries([
        {
          id: "drive-empty",
          name: "Empty Library",
          path: "Empty Library",
          type: "folder",
        },
      ])
    ).toEqual([
      expect.objectContaining({
        name: "Files",
        type: "folder",
        children: [
          expect.objectContaining({
            name: "Empty Library",
            path: "Empty Library",
            type: "folder",
            children: [],
          }),
        ],
      }),
    ])
  })
})
