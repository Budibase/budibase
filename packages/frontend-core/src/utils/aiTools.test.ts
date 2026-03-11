import { describe, expect, it } from "vitest"
import { formatToolName } from "./aiTools"

describe("formatToolName", () => {
  describe("without readableName", () => {
    it("humanizes underscored names", () => {
      expect(formatToolName("fetch_users")).toEqual({
        primary: "Fetch Users",
        full: "Fetch Users",
      })
    })

    it("humanizes hyphenated names", () => {
      expect(formatToolName("create-record")).toEqual({
        primary: "Create Record",
        full: "Create Record",
      })
    })

    it("humanizes mixed separators", () => {
      expect(formatToolName("get_all-records")).toEqual({
        primary: "Get All Records",
        full: "Get All Records",
      })
    })

    it("collapses multiple separators", () => {
      expect(formatToolName("fetch___users")).toEqual({
        primary: "Fetch Users",
        full: "Fetch Users",
      })
    })

    it("trims whitespace", () => {
      expect(formatToolName("  fetch_users  ")).toEqual({
        primary: "Fetch Users",
        full: "Fetch Users",
      })
    })

    it("handles single word", () => {
      expect(formatToolName("users")).toEqual({
        primary: "Users",
        full: "Users",
      })
    })
  })

  describe("with readableName", () => {
    it("splits on last dot into primary and secondary", () => {
      expect(formatToolName("raw", "datasource.fetch_rows")).toEqual({
        primary: "datasource",
        secondary: "Fetch Rows",
        full: "datasource - Fetch Rows",
      })
    })

    it("returns primary only when no dot present", () => {
      expect(formatToolName("raw", "fetch_rows")).toEqual({
        primary: "Fetch Rows",
        full: "Fetch Rows",
      })
    })

    it("handles dot at start (index 0) as single segment", () => {
      expect(formatToolName("raw", ".fetch_rows")).toEqual({
        primary: ".Fetch Rows",
        full: ".Fetch Rows",
      })
    })

    it("handles dot at end as single segment", () => {
      expect(formatToolName("raw", "datasource.")).toEqual({
        primary: "Datasource.",
        full: "Datasource.",
      })
    })

    it("splits on the last dot when multiple dots exist", () => {
      expect(formatToolName("raw", "group.datasource.fetch_rows")).toEqual({
        primary: "group.datasource",
        secondary: "Fetch Rows",
        full: "group.datasource - Fetch Rows",
      })
    })

    it("humanizes the secondary segment only", () => {
      expect(formatToolName("raw", "My Source.get_all_users")).toEqual({
        primary: "My Source",
        secondary: "Get All Users",
        full: "My Source - Get All Users",
      })
    })
  })
})
