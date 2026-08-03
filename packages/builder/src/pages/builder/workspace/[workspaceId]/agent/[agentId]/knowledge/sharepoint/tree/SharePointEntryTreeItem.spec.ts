import { render } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"
import { entryToNode } from "../sharePointScope"
import SharePointEntryTreeItem from "./SharePointEntryTreeItem.svelte"

const node = entryToNode({
  id: "drive-1:folder-1",
  name: "Policies",
  path: "Documents/Policies",
  type: "folder",
  driveId: "drive-1",
  itemId: "folder-1",
  hasChildren: true,
})

describe("SharePointEntryTreeItem", () => {
  it("uses selectable tree layout for disabled descendants", () => {
    const { container } = render(SharePointEntryTreeItem, {
      props: {
        selectable: true,
        node,
        scopeTargets: [],
        ancestorSelected: true,
      },
    })

    expect(container.querySelector(".sharepoint-entry-tree-item")).toHaveClass(
      "is-selectable"
    )
  })

  it("keeps the read-only tree layout when selection is disabled", () => {
    const { container } = render(SharePointEntryTreeItem, {
      props: {
        node,
      },
    })

    expect(
      container.querySelector(".sharepoint-entry-tree-item")
    ).not.toHaveClass("is-selectable")
  })
})
