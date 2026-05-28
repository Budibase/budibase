import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, waitFor } from "@testing-library/svelte"
import "@testing-library/jest-dom"

import SchemaPanel from "./SchemaPanel.svelte"

describe("SchemaPanel", () => {
  it("unwraps e.detail.fields when KeyValueBuilder dispatches a change", async () => {
    const onSchemaChange = vi.fn()
    const schema = { foo: { type: "string" } }

    const { container } = render(SchemaPanel, { schema, onSchemaChange })

    const nameInput = container.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement
    expect(nameInput).toBeTruthy()
    expect(nameInput.value).toBe("foo")

    await fireEvent.input(nameInput, { target: { value: "bar" } })
    await fireEvent.blur(nameInput)

    await waitFor(() => {
      expect(onSchemaChange).toHaveBeenCalled()
    })

    expect(onSchemaChange).toHaveBeenLastCalledWith({
      bar: { type: "string" },
    })
  })
})
