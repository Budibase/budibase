import { expect, describe, it, vi } from "vitest"
import {
  runtimeToReadableBinding,
  readableToRuntimeBinding,
  updateReferencesInObject,
} from "@/dataBinding"

describe("Builder dataBinding", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("runtimeToReadableBinding", () => {
    const bindableProperties = [
      {
        category: "Current User",
        icon: "User",
        providerId: "user",
        readableBinding: "Current User.firstName",
        runtimeBinding: "[user].[firstName]",
        type: "context",
      },
      {
        category: "Bindings",
        icon: "Brackets",
        readableBinding: "Binding.count",
        runtimeBinding: "count",
        type: "context",
      },
    ]
    it("should convert a runtime binding to a readable one", () => {
      const textWithBindings = `Hello {{ [user].[firstName] }}! The count is {{ count }}.`
      expect(
        runtimeToReadableBinding(
          bindableProperties,
          textWithBindings,
          "readableBinding"
        )
      ).toEqual(
        `Hello {{ Current User.firstName }}! The count is {{ Binding.count }}.`
      )
    })

    it("should not convert to readable binding if it is already readable", () => {
      const textWithBindings = `Hello {{ [user].[firstName] }}! The count is {{ Binding.count }}.`
      expect(
        runtimeToReadableBinding(
          bindableProperties,
          textWithBindings,
          "readableBinding"
        )
      ).toEqual(
        `Hello {{ Current User.firstName }}! The count is {{ Binding.count }}.`
      )
    })
  })

  describe("readableToRuntimeBinding", () => {
    const bindableProperties = [
      {
        category: "Current User",
        icon: "User",
        providerId: "user",
        readableBinding: "Current User.firstName",
        runtimeBinding: "[user].[firstName]",
        type: "context",
      },
      {
        category: "Bindings",
        icon: "Brackets",
        readableBinding: "Binding.count",
        runtimeBinding: "count",
        type: "context",
      },
    ]
    it("should convert a readable binding to a runtime one", () => {
      const textWithBindings = `Hello {{ Current User.firstName }}! The count is {{ Binding.count }}.`
      expect(
        readableToRuntimeBinding(
          bindableProperties,
          textWithBindings,
          "runtimeBinding"
        )
      ).toEqual(`Hello {{ [user].[firstName] }}! The count is {{ count }}.`)
    })
  })

  describe("updateReferencesInObject", () => {
    it("should increment steps in sequence on 'add'", () => {
      let obj = [
        {
          id: "a0",
          parameters: {
            text: "Alpha",
          },
        },
        {
          id: "a1",
          parameters: {
            text: "Apple",
          },
        },
        {
          id: "b2",
          parameters: {
            text: "Banana {{ actions.1.row }}",
          },
        },
        {
          id: "c3",
          parameters: {
            text: "Carrot {{ actions.1.row }}",
          },
        },
        {
          id: "d4",
          parameters: {
            text: "Dog {{ actions.3.row }}",
          },
        },
        {
          id: "e5",
          parameters: {
            text: "Eagle {{ actions.4.row }}",
          },
        },
      ]
      updateReferencesInObject({
        obj,
        modifiedIndex: 0,
        action: "add",
        label: "actions",
      })

      expect(obj).toEqual([
        {
          id: "a0",
          parameters: {
            text: "Alpha",
          },
        },
        {
          id: "a1",
          parameters: {
            text: "Apple",
          },
        },
        {
          id: "b2",
          parameters: {
            text: "Banana {{ actions.2.row }}",
          },
        },
        {
          id: "c3",
          parameters: {
            text: "Carrot {{ actions.2.row }}",
          },
        },
        {
          id: "d4",
          parameters: {
            text: "Dog {{ actions.4.row }}",
          },
        },
        {
          id: "e5",
          parameters: {
            text: "Eagle {{ actions.5.row }}",
          },
        },
      ])
    })

    it("should decrement steps in sequence on 'delete'", () => {
      let obj = [
        {
          id: "a1",
          parameters: {
            text: "Apple",
          },
        },
        {
          id: "b2",
          parameters: {
            text: "Banana {{ actions.1.row }}",
          },
        },
        {
          id: "d4",
          parameters: {
            text: "Dog {{ actions.3.row }}",
          },
        },
        {
          id: "e5",
          parameters: {
            text: "Eagle {{ actions.4.row }}",
          },
        },
      ]
      updateReferencesInObject({
        obj,
        modifiedIndex: 2,
        action: "delete",
        label: "actions",
      })

      expect(obj).toEqual([
        {
          id: "a1",
          parameters: {
            text: "Apple",
          },
        },
        {
          id: "b2",
          parameters: {
            text: "Banana {{ actions.1.row }}",
          },
        },
        {
          id: "d4",
          parameters: {
            text: "Dog {{ actions.2.row }}",
          },
        },
        {
          id: "e5",
          parameters: {
            text: "Eagle {{ actions.3.row }}",
          },
        },
      ])
    })

    it("should handle on 'move' to a lower index", () => {
      let obj = [
        {
          id: "a1",
          parameters: {
            text: "Apple",
          },
        },
        {
          id: "b2",
          parameters: {
            text: "Banana {{ actions.0.row }}",
          },
        },
        {
          id: "e5",
          parameters: {
            text: "Eagle {{ actions.3.row }}",
          },
        },
        {
          id: "c3",
          parameters: {
            text: "Carrot {{ actions.0.row }}",
          },
        },
        {
          id: "d4",
          parameters: {
            text: "Dog {{ actions.2.row }}",
          },
        },
      ]
      updateReferencesInObject({
        obj,
        modifiedIndex: 2,
        action: "move",
        label: "actions",
        originalIndex: 4,
      })

      expect(obj).toEqual([
        {
          id: "a1",
          parameters: {
            text: "Apple",
          },
        },
        {
          id: "b2",
          parameters: {
            text: "Banana {{ actions.0.row }}",
          },
        },
        {
          id: "e5",
          parameters: {
            text: "Eagle {{ actions.4.row }}",
          },
        },
        {
          id: "c3",
          parameters: {
            text: "Carrot {{ actions.0.row }}",
          },
        },
        {
          id: "d4",
          parameters: {
            text: "Dog {{ actions.3.row }}",
          },
        },
      ])
    })

    it("should handle on 'move' to a higher index", () => {
      let obj = [
        {
          id: "b2",
          parameters: {
            text: "Banana {{ actions.0.row }}",
          },
        },
        {
          id: "c3",
          parameters: {
            text: "Carrot {{ actions.0.row }}",
          },
        },
        {
          id: "a1",
          parameters: {
            text: "Apple",
          },
        },
        {
          id: "d4",
          parameters: {
            text: "Dog {{ actions.2.row }}",
          },
        },
        {
          id: "e5",
          parameters: {
            text: "Eagle {{ actions.3.row }}",
          },
        },
      ]
      updateReferencesInObject({
        obj,
        modifiedIndex: 2,
        action: "move",
        label: "actions",
        originalIndex: 0,
      })

      expect(obj).toEqual([
        {
          id: "b2",
          parameters: {
            text: "Banana {{ actions.2.row }}",
          },
        },
        {
          id: "c3",
          parameters: {
            text: "Carrot {{ actions.2.row }}",
          },
        },
        {
          id: "a1",
          parameters: {
            text: "Apple",
          },
        },
        {
          id: "d4",
          parameters: {
            text: "Dog {{ actions.1.row }}",
          },
        },
        {
          id: "e5",
          parameters: {
            text: "Eagle {{ actions.3.row }}",
          },
        },
      ])
    })

    it("should handle on 'move' of action being referenced, dragged to a higher index", () => {
      let obj = [
        {
          "##eventHandlerType": "Validate Form",
          id: "cCD0Dwcnq",
        },
        {
          "##eventHandlerType": "Close Screen Modal",
          id: "3fbbIOfN0H",
        },
        {
          "##eventHandlerType": "Save Row",
          parameters: {
            tableId: "ta_bb_employee",
          },
          id: "aehg5cTmhR",
        },
        {
          "##eventHandlerType": "Close Side Panel",
          id: "mzkpf86cxo",
        },
        {
          "##eventHandlerType": "Navigate To",
          id: "h0uDFeJa8A",
        },
        {
          parameters: {
            autoDismiss: true,
            type: "success",
            message: "{{ actions.1.row }}",
          },
          "##eventHandlerType": "Show Notification",
          id: "JEI5lAyJZ",
        },
      ]
      updateReferencesInObject({
        obj,
        modifiedIndex: 2,
        action: "move",
        label: "actions",
        originalIndex: 1,
      })

      expect(obj).toEqual([
        {
          "##eventHandlerType": "Validate Form",
          id: "cCD0Dwcnq",
        },
        {
          "##eventHandlerType": "Close Screen Modal",
          id: "3fbbIOfN0H",
        },
        {
          "##eventHandlerType": "Save Row",
          parameters: {
            tableId: "ta_bb_employee",
          },
          id: "aehg5cTmhR",
        },
        {
          "##eventHandlerType": "Close Side Panel",
          id: "mzkpf86cxo",
        },
        {
          "##eventHandlerType": "Navigate To",
          id: "h0uDFeJa8A",
        },
        {
          parameters: {
            autoDismiss: true,
            type: "success",
            message: "{{ actions.2.row }}",
          },
          "##eventHandlerType": "Show Notification",
          id: "JEI5lAyJZ",
        },
      ])
    })

    it("should handle on 'move' of action being referenced, dragged to a lower index", () => {
      let obj = [
        {
          "##eventHandlerType": "Save Row",
          parameters: {
            tableId: "ta_bb_employee",
          },
          id: "aehg5cTmhR",
        },
        {
          "##eventHandlerType": "Validate Form",
          id: "cCD0Dwcnq",
        },
        {
          "##eventHandlerType": "Close Screen Modal",
          id: "3fbbIOfN0H",
        },
        {
          "##eventHandlerType": "Close Side Panel",
          id: "mzkpf86cxo",
        },
        {
          "##eventHandlerType": "Navigate To",
          id: "h0uDFeJa8A",
        },
        {
          parameters: {
            autoDismiss: true,
            type: "success",
            message: "{{ actions.4.row }}",
          },
          "##eventHandlerType": "Show Notification",
          id: "JEI5lAyJZ",
        },
      ]
      updateReferencesInObject({
        obj,
        modifiedIndex: 0,
        action: "move",
        label: "actions",
        originalIndex: 4,
      })

      expect(obj).toEqual([
        {
          "##eventHandlerType": "Save Row",
          parameters: {
            tableId: "ta_bb_employee",
          },
          id: "aehg5cTmhR",
        },
        {
          "##eventHandlerType": "Validate Form",
          id: "cCD0Dwcnq",
        },
        {
          "##eventHandlerType": "Close Screen Modal",
          id: "3fbbIOfN0H",
        },
        {
          "##eventHandlerType": "Close Side Panel",
          id: "mzkpf86cxo",
        },
        {
          "##eventHandlerType": "Navigate To",
          id: "h0uDFeJa8A",
        },
        {
          parameters: {
            autoDismiss: true,
            type: "success",
            message: "{{ actions.0.row }}",
          },
          "##eventHandlerType": "Show Notification",
          id: "JEI5lAyJZ",
        },
      ])
    })
  })
})
