// @vitest-environment jsdom
import { enrichNavItems } from "./navUtils"
import { describe, it, expect } from "vitest"

describe("enrichNavItems", () => {
  it("keeps a sublinks parent whose sublinks don't match an accessible route", () => {
    const navItems = [
      { text: "Home", url: "/home", type: "link", roleId: "BASIC" },
      {
        text: "List",
        type: "sublinks",
        roleId: "BASIC",
        subLinks: [
          { text: "Sub 1", url: "/list", type: "link", roleId: "BASIC" },
        ],
      },
    ]

    const routeEntries = [
      { path: "/home", screenId: "s1" },
      { path: "/list/:id", screenId: "s2" },
    ]

    const userRoleHierarchy = ["ADMIN", "BASIC"]

    const enriched = enrichNavItems(navItems, userRoleHierarchy, routeEntries)

    expect(enriched.map(i => i.text)).toEqual(["Home", "List"])
  })

  it("keeps a sublinks parent that has an empty sublink (freshly added in drawer)", () => {
    const navItems = [
      {
        text: "List",
        type: "sublinks",
        roleId: "BASIC",
        subLinks: [{}],
      },
    ]

    const routeEntries = []
    const userRoleHierarchy = ["ADMIN", "BASIC"]

    const enriched = enrichNavItems(navItems, userRoleHierarchy, routeEntries)

    expect(enriched.map(i => i.text)).toEqual(["List"])
  })
})
