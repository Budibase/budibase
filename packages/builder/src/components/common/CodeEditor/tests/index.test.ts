import { describe, expect, it } from "vitest"

import { hbInsert, htmlInsert, jsInsert } from ".."

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
