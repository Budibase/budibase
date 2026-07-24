import { CompletionContext } from "@codemirror/autocomplete"
import { EditorState } from "@codemirror/state"
import type { EnrichedBinding } from "@budibase/types"
import { describe, expect, it } from "vitest"

import {
  bindingsToCompletions,
  EditorModes,
  hbAutocomplete,
  hbInsert,
  htmlInsert,
  jsInsert,
} from ".."

describe("hbAutocomplete", () => {
  it("finds bindings by their datasource category", () => {
    const warehouseBinding: EnrichedBinding = {
      runtimeBinding: "table_orders_list_rows",
      readableBinding: "Warehouse.Orders.list_rows",
      category: "Warehouse",
      display: {
        name: "Orders.List Rows",
        type: "tool",
      },
    }
    const doc = "{{ warehouse"
    const state = EditorState.create({ doc })
    const context = new CompletionContext(state, doc.length, false)
    const autocomplete = hbAutocomplete(
      bindingsToCompletions([warehouseBinding], EditorModes.Handlebars)
    )

    const result = autocomplete(context)

    expect(result?.options.map(option => option.label)).toContain(
      "Orders.List Rows"
    )
  })
})

describe("hbInsert", () => {
  it("wraps bindings when not inside existing handlebars", () => {
    const doc = "{{ first }} plain {{ second }}"
    const insertionPoint = doc.indexOf("plain ") + "plain ".length

    const result = hbInsert(doc, insertionPoint, insertionPoint, "user.roleId")

    expect(result).toBe("{{ user.roleId }}")
  })

  it("does not duplicate braces when already inside handlebars", () => {
    const doc = "{{ user.email }}"
    const insertionPoint = doc.indexOf("user.email")

    const result = hbInsert(doc, insertionPoint, insertionPoint, "user.roleId")

    expect(result).toBe(" user.roleId ")
  })

  it("closes a partially-open handlebars wrapper", () => {
    const doc = "{{"
    const insertionPoint = doc.length

    const result = hbInsert(doc, insertionPoint, insertionPoint, "user.roleId")

    expect(result).toBe(" user.roleId }}")
  })

  it("completes a single dangling opening brace", () => {
    const doc = "{"
    const insertionPoint = doc.length

    const result = hbInsert(doc, insertionPoint, insertionPoint, "user.roleId")

    expect(result).toBe("{ user.roleId }}")
  })
})

describe("htmlInsert", () => {
  it("adds missing handlebars even when other bindings are present", () => {
    const doc = "{{ first }} plain {{ second }}"
    const insertionPoint = doc.indexOf("plain ") + "plain ".length

    const result = htmlInsert(doc, insertionPoint, insertionPoint, "user.email")

    expect(result).toBe("{{ user.email }}")
  })

  it("respects existing wrappers inside handlebars", () => {
    const doc = "<div>{{ user.email }}</div>"
    const insertionPoint = doc.indexOf("user.email")

    const result = htmlInsert(
      doc,
      insertionPoint,
      insertionPoint,
      "user.roleId"
    )

    expect(result).toBe(" user.roleId ")
  })
})

describe("jsInsert", () => {
  it("wraps bindings with the javascript helper when outside", () => {
    const doc = '$("first") plain $("second")'
    const insertionPoint = doc.indexOf("plain ") + "plain ".length

    const result = jsInsert(
      doc,
      insertionPoint,
      insertionPoint,
      "binding.value"
    )

    expect(result).toBe('$("binding.value")')
  })

  it("leaves text untouched when already inside a javascript binding", () => {
    const doc = 'const val = $("user.email")'
    const insertionPoint = doc.indexOf("user.email")

    const result = jsInsert(doc, insertionPoint, insertionPoint, "user.roleId")

    expect(result).toBe("user.roleId")
  })
})
