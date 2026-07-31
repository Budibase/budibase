import { describe, expect, it } from "vitest"
import {
  addNavChild,
  canNavNest,
  effectiveNavRole,
  enforceSubtreeMinRole,
  filterNavTree,
  findNavNode,
  findNavPath,
  pruneNavLinksByUrl,
  removeNavNode,
  reorderNavChildren,
  updateNavNode,
} from "./navigationTree"

// Home(link), Reports(group) > Monthly(link), Archive(group) > 2023(link)
const tree = () => [
  { id: "home", text: "Home", type: "link", url: "/" },
  {
    id: "reports",
    text: "Reports",
    type: "sublinks",
    roleId: "BASIC",
    subLinks: [
      { id: "monthly", text: "Monthly", type: "link", url: "/reports/monthly" },
      {
        id: "archive",
        text: "Archive",
        type: "sublinks",
        roleId: "BASIC",
        subLinks: [
          { id: "y2023", text: "2023", type: "link", roleId: "BASIC" },
        ],
      },
    ],
  },
]

describe("navigationTree", () => {
  it("findNavNode finds nested nodes and misses cleanly", () => {
    expect(findNavNode(tree(), "y2023")?.text).toBe("2023")
    expect(findNavNode(tree(), "nope")).toBeUndefined()
  })

  it("findNavPath returns the root-to-node chain", () => {
    expect((findNavPath(tree(), "y2023") || []).map(n => n.id)).toEqual([
      "reports",
      "archive",
      "y2023",
    ])
    expect(findNavPath(tree(), "nope")).toBeNull()
  })

  it("updateNavNode patches a nested node without mutating the original", () => {
    const original = tree()
    const updated = updateNavNode(original, "monthly", { text: "Maand" })
    expect(findNavNode(updated, "monthly")?.text).toBe("Maand")
    expect(findNavNode(original, "monthly")?.text).toBe("Monthly")
  })

  it("addNavChild appends and promotes the parent to a group", () => {
    const updated = addNavChild(tree(), "monthly", { id: "new", text: "New" })
    const monthly = findNavNode(updated, "monthly")
    expect(monthly?.type).toBe("sublinks")
    expect(monthly?.subLinks?.map(n => n.id)).toEqual(["new"])
  })

  it("removeNavNode removes a nested group including its children", () => {
    const updated = removeNavNode(tree(), "archive")
    expect(findNavNode(updated, "archive")).toBeUndefined()
    expect(findNavNode(updated, "y2023")).toBeUndefined()
    expect(findNavNode(updated, "monthly")).toBeDefined()
  })

  it("reorderNavChildren replaces children at top level and nested", () => {
    const top = reorderNavChildren(tree(), null, tree().reverse())
    expect(top.map(n => n.id)).toEqual(["reports", "home"])
    const nested = reorderNavChildren(tree(), "reports", [
      { id: "archive" },
      { id: "monthly" },
    ])
    expect(findNavNode(nested, "reports")?.subLinks?.map(n => n.id)).toEqual([
      "archive",
      "monthly",
    ])
  })

  it("canNavNest allows depths 0 and 1, refuses 2", () => {
    expect(canNavNest(0)).toBe(true)
    expect(canNavNest(1)).toBe(true)
    expect(canNavNest(2)).toBe(false)
  })

  describe("enforceSubtreeMinRole", () => {
    // Toy graph: "manager" inherits "sales"; ADMIN is the super-role.
    const isAllowedUnder = (roleId, parentRoleId) =>
      roleId === "ADMIN" ||
      roleId === parentRoleId ||
      (roleId === "manager" && parentRoleId === "sales")

    it("raises descendants with an explicit, too permissive role", () => {
      const { links, raised } = enforceSubtreeMinRole(
        tree(),
        "reports",
        "sales",
        isAllowedUnder
      )
      // "archive" and "y2023" hold an explicit BASIC, which is not allowed
      // under "sales", so they are raised - and reported.
      expect(findNavNode(links, "archive")?.roleId).toBe("sales")
      expect(findNavNode(links, "y2023")?.roleId).toBe("sales")
      expect(raised).toEqual(["Archive", "2023"])
      // The group itself and unrelated top-level nodes stay untouched.
      expect(findNavNode(links, "reports")?.roleId).toBe("BASIC")
      expect(findNavNode(links, "home")?.roleId).toBeUndefined()
    })

    it("never pins an inheriting (role-less) item to a fixed role", () => {
      // "monthly" has no roleId: it follows its parent at runtime, so the rule
      // already holds and rewriting it would destroy that inheritance.
      const { links, raised } = enforceSubtreeMinRole(
        tree(),
        "reports",
        "sales",
        isAllowedUnder
      )
      expect(findNavNode(links, "monthly")?.roleId).toBeUndefined()
      expect(raised).not.toContain("Monthly")
    })

    it("is reversible: lowering the group again keeps items inheriting", () => {
      const raisedTree = enforceSubtreeMinRole(
        tree(),
        "reports",
        "sales",
        isAllowedUnder
      ).links
      const lowered = enforceSubtreeMinRole(
        raisedTree,
        "reports",
        "BASIC",
        isAllowedUnder
      ).links
      // The inheriting item still inherits, so it follows the group back down.
      expect(findNavNode(lowered, "monthly")?.roleId).toBeUndefined()
    })

    it("holds children to their own parent's stricter role", () => {
      // Archive ("manager") already satisfies the new "sales" minimum and
      // keeps its role - so its child must be raised to "manager", the minimum
      // for its own level, not to the edited group's "sales".
      const links = updateNavNode(tree(), "archive", { roleId: "manager" })
      const result = enforceSubtreeMinRole(
        links,
        "reports",
        "sales",
        isAllowedUnder
      )
      expect(findNavNode(result.links, "archive")?.roleId).toBe("manager")
      expect(findNavNode(result.links, "y2023")?.roleId).toBe("manager")
    })

    it("reaches a fixed point: re-running changes nothing", () => {
      // Every raise must satisfy the rule it was raised for, otherwise the same
      // node is reported again on the next run.
      const links = updateNavNode(tree(), "archive", { roleId: "manager" })
      const first = enforceSubtreeMinRole(
        links,
        "reports",
        "sales",
        isAllowedUnder
      )
      const second = enforceSubtreeMinRole(
        first.links,
        "reports",
        "sales",
        isAllowedUnder
      )
      expect(second.raised).toEqual([])
      expect(second.links).toEqual(first.links)
    })

    it("leaves an ADMIN descendant alone", () => {
      const links = updateNavNode(tree(), "archive", { roleId: "ADMIN" })
      const result = enforceSubtreeMinRole(
        links,
        "reports",
        "sales",
        isAllowedUnder
      )
      expect(findNavNode(result.links, "archive")?.roleId).toBe("ADMIN")
      expect(result.raised).not.toContain("Archive")
    })

    it("also works when the changed group is itself nested", () => {
      const { links } = enforceSubtreeMinRole(
        tree(),
        "archive",
        "sales",
        isAllowedUnder
      )
      expect(findNavNode(links, "y2023")?.roleId).toBe("sales")
      // Nodes outside the archive subtree stay untouched.
      expect(findNavNode(links, "monthly")?.roleId).toBeUndefined()
    })
  })

  describe("effectiveNavRole", () => {
    it("returns the nearest explicit role along the path", () => {
      const path = [{ id: "a", roleId: "sales" }, { id: "b" }, { id: "c" }]
      expect(effectiveNavRole(path, "BASIC")).toBe("sales")
    })

    it("falls back to the default when nothing on the path has a role", () => {
      expect(effectiveNavRole([{ id: "a" }, { id: "b" }], "BASIC")).toBe(
        "BASIC"
      )
      expect(effectiveNavRole([], "BASIC")).toBe("BASIC")
    })

    it("prefers the closest ancestor over a higher one", () => {
      const path = [{ roleId: "sales" }, { roleId: "manager" }]
      expect(effectiveNavRole(path, "BASIC")).toBe("manager")
    })
  })

  describe("filterNavTree", () => {
    // Route reachability is deliberately independent of whether a url is set,
    // so the harness cannot stand in for the "link has no url" check.
    const reachable = ["/", "/x", "/s", "/ok", "/reports/monthly", "/deep"]
    const filter = (links, overrides = {}) =>
      filterNavTree(links, {
        userRoleHierarchy: ["BASIC", "PUBLIC"],
        defaultRole: "BASIC",
        canAccessLink: node => reachable.includes(node.url),
        evaluateConditions: () => true,
        enrich: node => ({ ...node, enriched: true }),
        ...overrides,
      })

    it("keeps legacy sub links (no roleId) visible whenever their parent is", () => {
      const links = [
        {
          id: "g",
          text: "Group",
          type: "sublinks",
          roleId: "PUBLIC",
          subLinks: [{ id: "child", text: "Child", type: "link", url: "/x" }],
        },
      ]
      const result = filter(links, { userRoleHierarchy: ["PUBLIC"] })
      expect(findNavNode(result, "child")).toBeDefined()
    })

    it("hides a child with an explicit stricter role from lower users", () => {
      const links = [
        {
          id: "g",
          text: "Group",
          type: "sublinks",
          roleId: "PUBLIC",
          subLinks: [
            {
              id: "child",
              text: "Child",
              type: "link",
              url: "/x",
              roleId: "BASIC",
            },
          ],
        },
      ]
      const result = filter(links, { userRoleHierarchy: ["PUBLIC"] })
      // The child is hidden, and the group is dropped as it ends up empty.
      expect(result).toEqual([])
    })

    it("caps nesting at MAX_NAV_DEPTH and drops groups made empty by the cap", () => {
      const links = [
        {
          id: "l1",
          text: "L1",
          type: "sublinks",
          subLinks: [
            {
              id: "l2",
              text: "L2",
              type: "sublinks",
              subLinks: [
                {
                  id: "l3",
                  text: "L3",
                  type: "sublinks",
                  subLinks: [
                    { id: "l4", text: "L4", type: "link", url: "/deep" },
                  ],
                },
              ],
            },
          ],
        },
      ]
      const result = filter(links)
      // Depth 3 ("l3") only had a child beyond the cap, so the whole branch
      // collapses away.
      expect(findNavNode(result, "l4")).toBeUndefined()
      expect(findNavNode(result, "l3")).toBeUndefined()
      expect(result).toEqual([])
    })

    it("route-checks links but not groups, and strips text/url-less nodes", () => {
      const links = [
        { id: "nourl", text: "No url", type: "link", url: "" },
        { id: "notext", text: "", type: "link", url: "/x" },
        {
          id: "g",
          text: "Group",
          type: "sublinks",
          subLinks: [
            { id: "dead", text: "Dead", type: "link", url: "/gone" },
            { id: "ok", text: "Ok", type: "link", url: "/ok" },
          ],
        },
      ]
      const result = filter(links, {
        canAccessLink: node => node.url === "/ok",
      })
      expect(result.map(n => n.id)).toEqual(["g"])
      expect(findNavNode(result, "dead")).toBeUndefined()
      expect(findNavNode(result, "ok")).toBeDefined()
    })

    it("drops nested links without a url, like it does at top level", () => {
      const links = [
        {
          id: "g",
          text: "Group",
          type: "sublinks",
          subLinks: [
            { id: "nourl", text: "No url", type: "link", url: "" },
            { id: "ok", text: "Ok", type: "link", url: "/ok" },
          ],
        },
      ]
      const result = filter(links)
      expect(findNavNode(result, "nourl")).toBeUndefined()
      expect(findNavNode(result, "ok")).toBeDefined()
    })

    it("keeps a group whose own url is unreachable, but drops that url", () => {
      // A group header link to a screen the user cannot reach would render a
      // dead anchor; the group itself is still valid as a label.
      const links = [
        {
          id: "g",
          text: "Group",
          type: "sublinks",
          url: "/gone",
          subLinks: [{ id: "ok", text: "Ok", type: "link", url: "/ok" }],
        },
      ]
      const result = filter(links)
      expect(result[0].url).toBe("")
      expect(findNavNode(result, "ok")).toBeDefined()
    })

    it("drops an unreachable url on a nested group too", () => {
      const links = [
        {
          id: "outer",
          text: "Outer",
          type: "sublinks",
          subLinks: [
            {
              id: "inner",
              text: "Inner",
              type: "sublinks",
              url: "/gone",
              subLinks: [
                { id: "leaf", text: "Leaf", type: "link", url: "/ok" },
              ],
            },
          ],
        },
      ]
      const result = filter(links)
      expect(findNavNode(result, "inner")?.url).toBe("")
      expect(findNavNode(result, "leaf")).toBeDefined()
    })

    it("applies conditions to top level nodes too", () => {
      const links = [
        { id: "shown", text: "Shown", type: "link", url: "/s" },
        { id: "hidden", text: "Hidden", type: "link", url: "/h" },
      ]
      const result = filter(links, {
        evaluateConditions: node => node.id !== "hidden",
      })
      expect(result.map(n => n.id)).toEqual(["shown"])
    })

    it("applies conditions to children and enriches every kept node", () => {
      const links = [
        {
          id: "g",
          text: "Group",
          type: "sublinks",
          subLinks: [
            { id: "hidden", text: "Hidden", type: "link", url: "/h" },
            { id: "shown", text: "Shown", type: "link", url: "/s" },
          ],
        },
      ]
      const result = filter(links, {
        evaluateConditions: node => node.id !== "hidden",
      })
      expect(findNavNode(result, "hidden")).toBeUndefined()
      expect(findNavNode(result, "shown")?.enriched).toBe(true)
      expect(result[0].enriched).toBe(true)
    })
  })

  describe("pruneNavLinksByUrl", () => {
    it("removes matching links at every depth", () => {
      const updated = pruneNavLinksByUrl(tree(), ["/reports/monthly"])
      expect(findNavNode(updated, "monthly")).toBeUndefined()
      expect(findNavNode(updated, "y2023")).toBeDefined()
    })

    it("keeps a group whose header URL matches, only clearing the URL", () => {
      const links = updateNavNode(tree(), "archive", { url: "/archive" })
      const updated = pruneNavLinksByUrl(links, ["/archive"])
      expect(findNavNode(updated, "archive")?.url).toBe("")
      expect(findNavNode(updated, "y2023")).toBeDefined()
    })

    it("leaves unrelated links alone", () => {
      const updated = pruneNavLinksByUrl(tree(), ["/nope"])
      expect(updated).toEqual(tree())
    })
  })
})
