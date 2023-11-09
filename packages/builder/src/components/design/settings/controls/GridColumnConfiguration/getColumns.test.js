import { it, expect, describe, beforeEach, vi } from "vitest"
import { getColumns } from "./getColumns"

describe("getColumns", (ctx) => {
  beforeEach((ctx) => {
    ctx = {};
    ctx.schema = {
      "one": { name: "one", visible: "false", order: 0 },
      "two": { name: "two", visible: "true", order: 1 },
      "three": { name: "three", visible: "true", order: 2 },
      "four": { name: "four", visible: "false", order: 3 },
      "five": { name: "five", visible: "true", order: 4 }
    }

    ctx.primaryDisplayColumnName = "four"
    ctx.onChange = vi.fn();
    ctx.createComponent = (componentName, props) => {
      return { componentName, ...props };
    }
  });
  describe("converting old column format", (ctx) => {
    const rawColumns = [
      { displayName: "one", name: "one" },
      { displayName: "two", name: "two" },
    ];
    const formattedColumns = getColumns({
      columns, 
      schema: ctx.schema,
      primaryDisplayColumnName: ctx.primaryDisplayColumnName,
      onChange: ctx.onChange,
      createComponent: ctx.createComponent
    })
  })

  describe("default columns", () => {
  })

  describe("missing columns", () => {
  })

  describe("invalid columns", () => {
  })
})
