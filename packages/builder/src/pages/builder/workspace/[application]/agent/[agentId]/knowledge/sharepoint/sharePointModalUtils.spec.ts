import { describe, expect, it } from "vitest"
import { KnowledgeBaseFileStatus } from "@budibase/types"
import {
  buildEntryTree,
  isExcludeNewByDefaultPatterns,
  matchesConfiguredPatterns,
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

describe("sharePointModalUtils filter patterns", () => {
  it("treats !** as exclude-all (including nested paths)", () => {
    expect(matchesConfiguredPatterns("activities.txt", ["!**"])).toBe(false)
    expect(matchesConfiguredPatterns("folder 1/sub 1/file.pdf", ["!**"])).toBe(
      false
    )
  })

  it("recognizes exclude-new-by-default for !**", () => {
    expect(isExcludeNewByDefaultPatterns(["!**"])).toBe(true)
  })
})
