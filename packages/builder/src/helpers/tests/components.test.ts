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
        "@budibase/standard-components/table": {
          name: "Data table",
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

const component = (
  _id: string,
  _component: string,
  _instanceName = "",
  _children: Component[] = []
): Component => ({
  _id,
  _component,
  _instanceName,
  _children,
  _styles: {},
})

describe("component tree search", () => {
  it("normalises search terms", () => {
    expect(normaliseComponentSearchTerm("  Button  ")).toBe("button")
  })

  it("returns empty sets for an empty search", () => {
    const results = getComponentTreeSearchResults(
      [component("button-1", "@budibase/standard-components/button")],
      ""
    )

    expect(results.matchingIds.size).toBe(0)
    expect(results.visibleIds.size).toBe(0)
    expect(results.expandedIds.size).toBe(0)
  })

  it("matches instance names", () => {
    const button = component(
      "button-1",
      "@budibase/standard-components/button",
      "Save changes"
    )

    expect(componentMatchesSearchTerm(button, "save")).toBe(true)
  })

  it("matches default component text", () => {
    const customComponent = component("custom-1", "custom-widget")

    expect(componentMatchesSearchTerm(customComponent, "custom-widget")).toBe(
      true
    )
  })

  it("matches friendly component names", () => {
    const button = component("button-1", "@budibase/standard-components/button")

    expect(componentMatchesSearchTerm(button, "primary")).toBe(true)
  })

  it("matches component type names", () => {
    const widget = component("widget-1", "@example/components/custom-widget")

    expect(componentMatchesSearchTerm(widget, "custom-widget")).toBe(true)
  })

  it("does not match shared component type namespaces", () => {
    const link = component(
      "link-1",
      "@budibase/standard-components/link",
      "New Link"
    )

    expect(componentMatchesSearchTerm(link, "standard-components/l")).toBe(
      false
    )
    expect(componentMatchesSearchTerm(link, "budibase")).toBe(false)
    expect(componentMatchesSearchTerm(link, "a")).toBe(false)
  })

  it("includes ancestors of descendant matches", () => {
    const tree = [
      component("container-1", "@budibase/standard-components/container", "", [
        component("table-1", "@budibase/standard-components/table"),
      ]),
    ]

    const results = getComponentTreeSearchResults(tree, "data table")

    expect(Array.from(results.matchingIds)).toEqual(["table-1"])
    expect(Array.from(results.visibleIds).sort()).toEqual([
      "container-1",
      "table-1",
    ])
    expect(Array.from(results.expandedIds)).toEqual(["container-1"])
  })

  it("includes descendants of matching containers", () => {
    const tree = [
      component(
        "container-1",
        "@budibase/standard-components/container",
        "Outer panel",
        [
          component("button-1", "@budibase/standard-components/button"),
          component(
            "container-2",
            "@budibase/standard-components/container",
            "Inner panel",
            [component("table-1", "@budibase/standard-components/table")]
          ),
        ]
      ),
      component("button-2", "@budibase/standard-components/button"),
    ]

    const results = getComponentTreeSearchResults(tree, "outer")

    expect(Array.from(results.matchingIds)).toEqual(["container-1"])
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
      [component("button-1", "@budibase/standard-components/button")],
      "missing"
    )

    expect(results.matchingIds.size).toBe(0)
    expect(results.visibleIds.size).toBe(0)
    expect(results.expandedIds.size).toBe(0)
  })
})
