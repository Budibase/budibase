import { describe, expect, it, vi } from "vitest"
import type { Component } from "@budibase/types"

vi.mock("@/stores/builder", async () => {
  const { writable } = await import("svelte/store")

  return {
    componentStore: writable({
      components: {
        "@budibase/standard-components/button": {
          friendlyName: "Primary button",
          name: "Button",
        },
        "@budibase/standard-components/container": {
          name: "Container",
        },
        "@budibase/standard-components/textv2": {
          name: "Text",
        },
      },
    }),
  }
})

import {
  componentMatchesSearchTerm,
  getComponentTreeSearchResults,
  normaliseComponentSearchTerm,
} from "@/helpers/components"

interface ComponentTestConfig {
  id: string
  type: string
  name?: string
  children?: Component[]
}

const component = ({
  id,
  type,
  name = "",
  children = [],
}: ComponentTestConfig): Component => ({
  _id: id,
  _component: type,
  _instanceName: name,
  _children: children,
  _styles: {},
})

describe("component tree search", () => {
  it("normalises search terms", () => {
    expect(normaliseComponentSearchTerm("  Button  ")).toBe("button")
  })

  it("returns empty sets for an empty search", () => {
    const results = getComponentTreeSearchResults(
      [
        component({
          id: "button-1",
          type: "@budibase/standard-components/button",
        }),
      ],
      ""
    )

    expect(results.matchingIds.size).toBe(0)
    expect(results.visibleIds.size).toBe(0)
    expect(results.expandedIds.size).toBe(0)
  })

  it("matches component labels shown in the tree", () => {
    const button = component({
      id: "button-1",
      type: "@budibase/standard-components/button",
      name: "Save changes",
    })
    const table = component({
      id: "table-1",
      type: "@budibase/standard-components/table",
    })

    expect(componentMatchesSearchTerm(button, "save")).toBe(true)
    expect(componentMatchesSearchTerm(table, "table")).toBe(true)
  })

  it("matches component type names but not hidden metadata", () => {
    const renamedButton = component({
      id: "button-1",
      type: "@budibase/standard-components/button",
      name: "Save changes",
    })
    const renamedContainer = component({
      id: "container-1",
      type: "@budibase/standard-components/container",
      name: "Outer panel",
    })
    const renamedText = component({
      id: "text-1",
      type: "@budibase/standard-components/textv2",
      name: "bruh",
    })

    expect(componentMatchesSearchTerm(renamedButton, "button")).toBe(true)
    expect(componentMatchesSearchTerm(renamedContainer, "container")).toBe(true)
    expect(componentMatchesSearchTerm(renamedButton, "primary")).toBe(false)
    expect(componentMatchesSearchTerm(renamedText, "textv2")).toBe(false)
    expect(componentMatchesSearchTerm(renamedText, "v")).toBe(false)
  })

  it("includes ancestors of descendant matches", () => {
    const tree = [
      component({
        id: "container-1",
        type: "@budibase/standard-components/container",
        children: [
          component({
            id: "table-1",
            type: "@budibase/standard-components/table",
          }),
        ],
      }),
    ]

    const results = getComponentTreeSearchResults(tree, "table")

    expect(Array.from(results.matchingIds)).toEqual(["table-1"])
    expect(Array.from(results.visibleIds).sort()).toEqual([
      "container-1",
      "table-1",
    ])
    expect(Array.from(results.expandedIds)).toEqual(["container-1"])
  })

  it("includes descendants of matching containers", () => {
    const tree = [
      component({
        id: "container-1",
        type: "@budibase/standard-components/container",
        name: "Outer panel",
        children: [
          component({
            id: "button-1",
            type: "@budibase/standard-components/button",
          }),
          component({
            id: "container-2",
            type: "@budibase/standard-components/container",
            name: "Inner panel",
            children: [
              component({
                id: "table-1",
                type: "@budibase/standard-components/table",
              }),
            ],
          }),
        ],
      }),
      component({
        id: "button-2",
        type: "@budibase/standard-components/button",
      }),
    ]

    const results = getComponentTreeSearchResults(tree, "container")

    expect(Array.from(results.matchingIds)).toEqual([
      "container-1",
      "container-2",
    ])
    expect(Array.from(results.visibleIds)).toEqual([
      "container-1",
      "button-1",
      "container-2",
      "table-1",
    ])
    expect(Array.from(results.expandedIds)).toEqual([
      "container-1",
      "container-2",
    ])
  })

  it("returns empty sets when there are no matches", () => {
    const results = getComponentTreeSearchResults(
      [
        component({
          id: "button-1",
          type: "@budibase/standard-components/button",
        }),
      ],
      "missing"
    )

    expect(results.matchingIds.size).toBe(0)
    expect(results.visibleIds.size).toBe(0)
    expect(results.expandedIds.size).toBe(0)
  })
})
