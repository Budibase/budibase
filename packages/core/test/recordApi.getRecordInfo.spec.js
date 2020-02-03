import { folderStructureArray } from "../src/indexing/allIds"
import { getRecordInfo } from "../src/recordApi/recordInfo"
import { setupApphierarchy } from "./specHelpers"

describe("getRecordInfo", () => {
  it("dir should not be sharded when record count = 1000", async () => {
    const { root } = (await setup({ parentCount: 1000 })).appHierarchy
    const { dir } = getRecordInfo(root, "/parents/1-abcd")
    expect(dir).toBe("/parents/1/1-abcd")
  })

  it("dir should be sharded when record count = 1001", async () => {
    const { root } = (await setup({ parentCount: 1001 })).appHierarchy
    const { dir } = getRecordInfo(root, "/parents/1-abcd")
    expect(dir).toBe("/parents/1/0123456789abcdefghijklmnopqrstuv/1-abcd")
  })

  it("dir should be sharded to one char per folder when record count = 63,000 (64*1000)", async () => {
    const { root } = (await setup({ parentCount: 64000 })).appHierarchy
    const { dir } = getRecordInfo(root, "/parents/1-abcd")
    expect(dir).toBe("/parents/1/a/1-abcd")
  })

  it("dir should be sharded to one char per folder, on 2 levels when record count = 4096000 (64*64*1000)", async () => {
    const { root } = (await setup({ parentCount: 4096000 })).appHierarchy
    const { dir } = getRecordInfo(root, "/parents/1-abcd")
    expect(dir).toBe("/parents/1/a/b/1-abcd")
  })

  it("child dir should not be sharded when record count = 1000", async () => {
    const { root, child } = (
      await setup({ parentCount: 4096000, childCount: 1000 })
    ).appHierarchy
    const { dir } = getRecordInfo(
      root,
      `/parents/1-abcd/children/${child.nodeId}-defg`
    )
    expect(dir).toBe(
      `/parents/1/a/b/1-abcd/children/${child.nodeId}/${child.nodeId}-defg`
    )
  })

  it("grandchild dir should not be sharded when record count = 1000", async () => {
    const { root, child, grandchild } = (
      await setup({ parentCount: 4096000, childCount: 4096000 })
    ).appHierarchy
    const { dir } = getRecordInfo(
      root,
      `/parents/1-abcd/children/${child.nodeId}-defg/grandchildren/${grandchild.nodeId}-hijk`
    )
    expect(dir).toBe(
      `/parents/1/a/b/1-abcd/children/${child.nodeId}/d/e/${child.nodeId}-defg/grandchildren/${grandchild.nodeId}/${grandchild.nodeId}-hijk`
    )
  })

  it("grandchild dir should be sharded when record count = 4096000", async () => {
    const { root, child, grandchild } = (
      await setup({
        parentCount: 4096000,
        childCount: 4096000,
        grandChildCount: 4096000,
      })
    ).appHierarchy
    const { dir } = getRecordInfo(
      root,
      `/parents/1-abcd/children/${child.nodeId}-defg/grandchildren/${grandchild.nodeId}-hijk`
    )
    expect(dir).toBe(
      `/parents/1/a/b/1-abcd/children/${child.nodeId}/d/e/${child.nodeId}-defg/grandchildren/${grandchild.nodeId}/h/i/${grandchild.nodeId}-hijk`
    )
  })

  it("child levels can be sharded, with parent not", async () => {
    const { root, child, grandchild } = (
      await setup({
        parentCount: 1000,
        childCount: 4096000,
        grandChildCount: 4096000,
      })
    ).appHierarchy
    const { dir } = getRecordInfo(
      root,
      `/parents/1-abcd/children/${child.nodeId}-defg/grandchildren/${grandchild.nodeId}-hijk`
    )
    expect(dir).toBe(
      `/parents/1/1-abcd/children/${child.nodeId}/d/e/${child.nodeId}-defg/grandchildren/${grandchild.nodeId}/h/i/${grandchild.nodeId}-hijk`
    )
  })
})

describe("folderStructureArray", () => {
  const recordNode = count => ({ estimatedRecordCount: count })

  it("should return [] when folder count < 1000", () => {
    const result = folderStructureArray(recordNode(999))
    expect(result).toEqual([])
  })

  it("should return [4] when folder count between 3000 - 4000", () => {
    const result = folderStructureArray(recordNode(3456))
    expect(result).toEqual([4])
  })

  it("should return [64, 2] when folder count between 64000 - 65000", () => {
    const result = folderStructureArray(recordNode(64001))
    expect(result).toEqual([64, 2])
  })

  it("should return [64, 64] when folder = 4095999", () => {
    const result = folderStructureArray(recordNode(4095999))
    expect(result).toEqual([64, 64])
  })

  it("should return [64, 64] when folder = 4096000", () => {
    const result = folderStructureArray(recordNode(4096000))
    expect(result).toEqual([64, 64])
  })

  it("should return [64, 64, 2] when folder = 4096001", () => {
    const result = folderStructureArray(recordNode(4096001))
    expect(result).toEqual([64, 64, 2])
  })
})

const setup = ({ parentCount, childCount, grandChildCount }) =>
  setupApphierarchy(templateApi => {
    const root = templateApi.getNewRootLevel()

    const addField = recordNode => {
      const field = templateApi.getNewField("string")
      field.name = "test"
      templateApi.addField(recordNode, field)
      return field
    }

    const parent = templateApi.getNewRecordTemplate(root, "parent")
    parent.estimatedRecordCount = parentCount || 1000
    parent.collectionName = "parents"
    addField(parent)
    const child = templateApi.getNewRecordTemplate(parent, "child")
    child.estimatedRecordCount = childCount || 1000
    child.collectionName = "children"
    addField(child)
    const grandchild = templateApi.getNewRecordTemplate(child, "grandchild")
    grandchild.estimatedRecordCount = grandChildCount || 1000
    grandchild.collectionName = "grandchildren"
    addField(grandchild)

    return {
      parent,
      child,
      grandchild,
      root,
    }
  })
