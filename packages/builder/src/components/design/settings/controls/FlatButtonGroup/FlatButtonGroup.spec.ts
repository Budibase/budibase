import { render, fireEvent, screen } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import FlatButtonGroup from "./FlatButtonGroup.svelte"

describe("FlatButtonGroup", () => {
  it("emits the remaining selected values when deselecting in multi-select mode", async () => {
    const onChange = vi.fn()

    render(FlatButtonGroup, {
      props: {
        isMultiSelect: true,
        value: ["columns", "rows"],
        onChange,
        buttonProps: [
          { text: "Columns", value: "columns" },
          { text: "Rows", value: "rows" },
          { text: "Cards", value: "cards" },
        ],
      },
    })

    await fireEvent.click(screen.getByText("Columns"))

    expect(onChange).toHaveBeenCalledWith(["rows"])
  })

  it("emits the full selection when adding a new value in multi-select mode", async () => {
    const onChange = vi.fn()

    render(FlatButtonGroup, {
      props: {
        isMultiSelect: true,
        value: ["rows"],
        onChange,
        buttonProps: [
          { text: "Columns", value: "columns" },
          { text: "Rows", value: "rows" },
        ],
      },
    })

    await fireEvent.click(screen.getByText("Columns"))

    expect(onChange).toHaveBeenCalledWith(["rows", "columns"])
  })
})
