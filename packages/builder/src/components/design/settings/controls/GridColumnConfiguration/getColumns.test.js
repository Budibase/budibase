import { it, expect, describe, beforeEach, vi } from "vitest"
import getColumns from "./getColumns"

describe("getColumns", () => {
  beforeEach(ctx => {
    ctx.schema = {
      one: { name: "one", visible: false, order: 0, type: "foo" },
      two: { name: "two", visible: true, order: 1, type: "foo" },
      three: { name: "three", visible: true, order: 2, type: "foo" },
      four: { name: "four", visible: false, order: 3, type: "foo" },
      five: {
        name: "excluded",
        visible: true,
        order: 4,
        type: "foo",
        nestedJSON: true,
      },
    }

    ctx.primaryDisplayColumnName = "four"
    ctx.onChange = vi.fn()
    ctx.createComponent = (componentName, props) => {
      return { componentName, ...props }
    }
  })

  describe("nested json fields", () => {
    beforeEach(ctx => {
      ctx.columns = getColumns({
        columns: null,
        schema: ctx.schema,
        primaryDisplayColumnName: ctx.primaryDisplayColumnName,
        onChange: ctx.onChange,
        createComponent: ctx.createComponent,
      })
    })

    it("does not return nested json fields, as the grid cannot display them", ctx => {
      expect(ctx.columns.sortable).not.toContainEqual({
        name: "excluded",
        visible: true,
        order: 4,
        type: "foo",
        nestedJSON: true,
      })
    })
  })

  describe("using the old grid column format", () => {
    beforeEach(ctx => {
      const oldGridFormatColumns = [
        { displayName: "three label", name: "three" },
        { displayName: "two label", name: "two" },
      ]

      ctx.columns = getColumns({
        columns: oldGridFormatColumns,
        schema: ctx.schema,
        primaryDisplayColumnName: ctx.primaryDisplayColumnName,
        onChange: ctx.onChange,
        createComponent: ctx.createComponent,
      })
    })

    it("returns the selected and unselected fields in the modern format, respecting the original order", ctx => {
      expect(ctx.columns.sortable).toEqual([
        {
          _id: "three",
          _instanceName: "three",
          active: true,
          columnType: "foo",
          componentName: "@budibase/standard-components/labelfield",
          field: "three",
          label: "three label",
          conditions: undefined,
          schema: ctx.schema,
        },
        {
          _id: "two",
          _instanceName: "two",
          active: true,
          columnType: "foo",
          componentName: "@budibase/standard-components/labelfield",
          field: "two",
          label: "two label",
          conditions: undefined,
          schema: ctx.schema,
        },
        {
          _id: "one",
          _instanceName: "one",
          active: false,
          columnType: "foo",
          componentName: "@budibase/standard-components/labelfield",
          field: "one",
          label: "one",
          conditions: undefined,
          schema: ctx.schema,
        },
      ])

      expect(ctx.columns.primary).toEqual({
        _id: "four",
        _instanceName: "four",
        active: true,
        columnType: "foo",
        componentName: "@budibase/standard-components/labelfield",
        field: "four",
        label: "four",
        conditions: undefined,
        schema: ctx.schema,
      })
    })
  })

  describe("default columns", () => {
    beforeEach(ctx => {
      ctx.columns = getColumns({
        columns: undefined,
        schema: ctx.schema,
        primaryDisplayColumnName: ctx.primaryDisplayColumnName,
        onChange: ctx.onChange,
        createComponent: ctx.createComponent,
      })
    })

    it("returns all columns, with non-hidden columns automatically selected", ctx => {
      expect(ctx.columns.sortable).toEqual([
        {
          _id: "two",
          _instanceName: "two",
          active: true,
          columnType: "foo",
          componentName: "@budibase/standard-components/labelfield",
          field: "two",
          label: "two",
          conditions: undefined,
          schema: ctx.schema,
        },
        {
          _id: "three",
          _instanceName: "three",
          active: true,
          columnType: "foo",
          componentName: "@budibase/standard-components/labelfield",
          field: "three",
          label: "three",
          conditions: undefined,
          schema: ctx.schema,
        },
        {
          _id: "one",
          _instanceName: "one",
          active: false,
          columnType: "foo",
          componentName: "@budibase/standard-components/labelfield",
          field: "one",
          label: "one",
          conditions: undefined,
          schema: ctx.schema,
        },
      ])

      expect(ctx.columns.primary).toEqual({
        _id: "four",
        _instanceName: "four",
        active: true,
        columnType: "foo",
        componentName: "@budibase/standard-components/labelfield",
        field: "four",
        label: "four",
        conditions: undefined,
        schema: ctx.schema,
      })
    })

    it("Unselected columns should be placed at the end", ctx => {
      expect(ctx.columns.sortable[2].field).toEqual("one")
    })
  })

  describe("missing columns", () => {
    beforeEach(ctx => {
      const gridFormatColumns = [
        { label: "three label", field: "three", active: true },
      ]

      ctx.columns = getColumns({
        columns: gridFormatColumns,
        schema: ctx.schema,
        primaryDisplayColumnName: ctx.primaryDisplayColumnName,
        onChange: ctx.onChange,
        createComponent: ctx.createComponent,
      })
    })

    it("returns all columns, including those missing from the initial data", ctx => {
      expect(ctx.columns.sortable).toEqual([
        {
          _id: "three",
          _instanceName: "three",
          active: true,
          columnType: "foo",
          componentName: "@budibase/standard-components/labelfield",
          field: "three",
          label: "three label",
          conditions: undefined,
          schema: ctx.schema,
        },
        {
          _id: "two",
          _instanceName: "two",
          active: false,
          columnType: "foo",
          componentName: "@budibase/standard-components/labelfield",
          field: "two",
          label: "two",
          conditions: undefined,
          schema: ctx.schema,
        },
        {
          _id: "one",
          _instanceName: "one",
          active: false,
          columnType: "foo",
          componentName: "@budibase/standard-components/labelfield",
          field: "one",
          label: "one",
          conditions: undefined,
          schema: ctx.schema,
        },
      ])

      expect(ctx.columns.primary).toEqual({
        _id: "four",
        _instanceName: "four",
        active: true,
        columnType: "foo",
        componentName: "@budibase/standard-components/labelfield",
        field: "four",
        label: "four",
        conditions: undefined,
        schema: ctx.schema,
      })
    })
  })

  describe("invalid columns", () => {
    beforeEach(ctx => {
      const gridFormatColumns = [
        { label: "three label", field: "three", active: true },
        { label: "some nonsense", field: "some nonsense", active: true },
      ]

      ctx.columns = getColumns({
        columns: gridFormatColumns,
        schema: ctx.schema,
        primaryDisplayColumnName: ctx.primaryDisplayColumnName,
        onChange: ctx.onChange,
        createComponent: ctx.createComponent,
      })
    })

    it("returns all valid columns, excluding those that aren't valid for the schema", ctx => {
      expect(ctx.columns.sortable).toEqual([
        {
          _id: "three",
          _instanceName: "three",
          active: true,
          columnType: "foo",
          componentName: "@budibase/standard-components/labelfield",
          field: "three",
          label: "three label",
          conditions: undefined,
          schema: ctx.schema,
        },
        {
          _id: "two",
          _instanceName: "two",
          active: false,
          columnType: "foo",
          componentName: "@budibase/standard-components/labelfield",
          field: "two",
          label: "two",
          conditions: undefined,
          schema: ctx.schema,
        },
        {
          _id: "one",
          _instanceName: "one",
          active: false,
          columnType: "foo",
          componentName: "@budibase/standard-components/labelfield",
          field: "one",
          label: "one",
          conditions: undefined,
          schema: ctx.schema,
        },
      ])

      expect(ctx.columns.primary).toEqual({
        _id: "four",
        _instanceName: "four",
        active: true,
        columnType: "foo",
        componentName: "@budibase/standard-components/labelfield",
        field: "four",
        label: "four",
        conditions: undefined,
        schema: ctx.schema,
      })
    })
  })

  describe("methods", () => {
    beforeEach(ctx => {
      const { update, updateSortable } = getColumns({
        columns: [],
        schema: ctx.schema,
        primaryDisplayColumnName: ctx.primaryDisplayColumnName,
        onChange: ctx.onChange,
        createComponent: ctx.createComponent,
      })

      ctx.update = update
      ctx.updateSortable = updateSortable
    })

    describe("update", () => {
      beforeEach(ctx => {
        ctx.update({
          field: "one",
          label: "a new label",
          active: true,
        })
      })

      it("calls the callback with the updated columns", ctx => {
        expect(ctx.onChange).toHaveBeenCalledTimes(1)
        expect(ctx.onChange).toHaveBeenCalledWith([
          {
            field: "two",
            label: "two",
            active: true,
          },
          {
            field: "three",
            label: "three",
            active: true,
          },
          {
            field: "one",
            label: "a new label",
            active: true,
          },
          {
            field: "four",
            label: "four",
            active: true,
          },
        ])
      })
    })

    describe("updateSortable", () => {
      beforeEach(ctx => {
        ctx.updateSortable([
          {
            _id: "three",
            _instanceName: "three",
            active: true,
            columnType: "foo",
            componentName: "@budibase/standard-components/labelfield",
            field: "three",
            label: "three",
          },
          {
            _id: "one",
            _instanceName: "one",
            active: true,
            columnType: "foo",
            componentName: "@budibase/standard-components/labelfield",
            field: "one",
            label: "one",
          },
          {
            _id: "two",
            _instanceName: "two",
            active: false,
            columnType: "foo",
            componentName: "@budibase/standard-components/labelfield",
            field: "two",
            label: "two",
          },
        ])
      })

      it("calls the callback with the updated columns", ctx => {
        expect(ctx.onChange).toHaveBeenCalledTimes(1)
        expect(ctx.onChange).toHaveBeenCalledWith([
          {
            field: "three",
            label: "three",
            active: true,
          },
          {
            field: "one",
            label: "one",
            active: true,
          },
          {
            field: "two",
            label: "two",
            active: false,
          },
          {
            field: "four",
            label: "four",
            active: true,
          },
        ])
      })
    })
  })
})
