import { render, screen } from "@testing-library/svelte"
import { encodeJSBinding } from "@budibase/string-templates"
import { describe, expect, it, vi } from "vitest"

vi.mock("@budibase/bbui", async () => {
  const { default: Button } = await import("../tests/MockButton.svelte")
  const { default: Drawer } = await import("../tests/MockDrawer.svelte")
  const { default: Icon } = await import("../tests/MockIcon.svelte")
  const { default: Input } = await import("../tests/MockInput.svelte")

  return {
    Button,
    Drawer,
    Helpers: {
      uuid: () => "test-id",
    },
    Icon,
    Input,
    TextArea: Input,
  }
})

vi.mock("@/stores/builder", () => ({
  builderStore: {
    propertyFocus: vi.fn(),
  },
}))

vi.mock("@/components/common/bindings/ClientBindingPanel.svelte", async () => {
  const { default: MockDrawer } = await import("../tests/MockDrawer.svelte")

  return {
    default: MockDrawer,
  }
})

import DrawerBindableInput from "./DrawerBindableInput.svelte"

describe("DrawerBindableInput", () => {
  it("renders JavaScript bindings as text even when the input type is number", () => {
    render(DrawerBindableInput, {
      props: {
        value: encodeJSBinding("return 1"),
        inputType: "number",
        placeholder: "Value",
      },
    })

    const input = screen.getByRole("textbox")
    expect(input).toHaveAttribute("type", "text")
    expect(input).toHaveValue("(JavaScript function)")
    expect(input).toHaveAttribute("readonly")
  })
})
