import { ToolType } from "@budibase/types"
import { describe, expect, it } from "vitest"

import {
  getToolBindingCategory,
  getIncludedToolRuntimeBindings,
} from "./toolBindingUtils"

describe("getIncludedToolRuntimeBindings", () => {
  const bindingsMap = {
    "tools.users.find": "{{ budibase.tools.users.find }}",
    "tools.orders.list": "{{ budibase.tools.orders.list }}",
    "tools.search.web": "{{ budibase.tools.search.web }}",
  }

  it("returns an empty list for undefined, null, and empty prompts", () => {
    expect(getIncludedToolRuntimeBindings(undefined, bindingsMap)).toEqual([])
    expect(getIncludedToolRuntimeBindings(null, bindingsMap)).toEqual([])
    expect(getIncludedToolRuntimeBindings("", bindingsMap)).toEqual([])
  })

  it("matches bindings with different surrounding whitespace", () => {
    const prompt = [
      "Use {{ tools.users.find }} first.",
      "Then use {{tools.orders.list}}.",
      "Optionally use {{   tools.search.web   }}.",
    ].join("\n")

    expect(getIncludedToolRuntimeBindings(prompt, bindingsMap)).toEqual([
      "{{ budibase.tools.users.find }}",
      "{{ budibase.tools.orders.list }}",
      "{{ budibase.tools.search.web }}",
    ])
  })

  it("deduplicates repeated bindings", () => {
    const prompt =
      "{{ tools.users.find }} {{ tools.users.find }} {{ tools.orders.list }}"

    expect(getIncludedToolRuntimeBindings(prompt, bindingsMap)).toEqual([
      "{{ budibase.tools.users.find }}",
      "{{ budibase.tools.orders.list }}",
    ])
  })

  it("ignores unknown bindings", () => {
    const prompt = "{{ tools.unknown }} {{ tools.users.find }}"

    expect(getIncludedToolRuntimeBindings(prompt, bindingsMap)).toEqual([
      "{{ budibase.tools.users.find }}",
    ])
  })

  it("ignores malformed handlebars fragments", () => {
    const prompt =
      "{{ tools.users.find {{ tools.orders.list }} {{ tools.search.web"

    expect(getIncludedToolRuntimeBindings(prompt, bindingsMap)).toEqual([
      "{{ budibase.tools.orders.list }}",
    ])
  })

  it("keeps first-seen order of unique matches", () => {
    const prompt =
      "{{ tools.search.web }} {{ tools.users.find }} {{ tools.search.web }} {{ tools.orders.list }}"

    expect(getIncludedToolRuntimeBindings(prompt, bindingsMap)).toEqual([
      "{{ budibase.tools.search.web }}",
      "{{ budibase.tools.users.find }}",
      "{{ budibase.tools.orders.list }}",
    ])
  })
})

describe("getToolBindingCategory", () => {
  it("groups rest query bindings by api connection name", () => {
    expect(getToolBindingCategory(ToolType.REST_QUERY, "First API")).toBe(
      "First API"
    )
    expect(getToolBindingCategory(ToolType.REST_QUERY, "Second API")).toBe(
      "Second API"
    )
  })
})
