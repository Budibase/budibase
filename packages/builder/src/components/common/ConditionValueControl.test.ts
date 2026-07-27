import { fireEvent, render, screen } from "@testing-library/svelte"
import { FieldType } from "@budibase/types"
import { describe, expect, it, vi } from "vitest"

vi.mock("@budibase/bbui", async () => {
  const { default: Select } = await import("./tests/MockSelect.svelte")
  const { default: DatePicker } = await import("./tests/MockDatePicker.svelte")
  const { default: Input } = await import("./tests/MockInput.svelte")
  const { default: Drawer } = await import("./tests/MockDrawer.svelte")
  const { default: Button } = await import("./tests/MockButton.svelte")
  const { default: Icon } = await import("./tests/MockIcon.svelte")

  return {
    Button,
    DatePicker,
    Drawer,
    Helpers: {
      uuid: () => "test-session-id",
    },
    Icon,
    Input,
    Select,
  }
})

vi.mock("@/dataBinding", () => ({
  readableToRuntimeBinding: (_bindings: any[], value: any) => value,
  runtimeToReadableBinding: (_bindings: any[], value: any) => value,
}))

vi.mock("@/components/common/bindings/ClientBindingPanel.svelte", async () => {
  return {
    default: (await import("./tests/MockClientBindingPanel.svelte")).default,
  }
})

vi.mock("@/components/common/bindings/DrawerBindableInput.svelte", async () => {
  const { default: MockDrawerBindableInput } = await import(
    "./tests/MockDrawerBindableInput.svelte"
  )

  return {
    default: MockDrawerBindableInput,
  }
})

import ConditionValueControl from "./ConditionValueControl.svelte"

const renderControl = (props: Record<string, any> = {}) => {
  const onChange = vi.fn()
  const onBlur = vi.fn()
  const componentProps: Record<string, any> = {
    value: null,
    valueType: FieldType.STRING,
    bindings: [],
    ...props,
  }
  const instance = render(ConditionValueControl, {
    props: componentProps,
    events: {
      blur: event => onBlur(event.detail),
      change: event => onChange(event.detail),
    },
  })

  return {
    ...instance,
    onBlur,
    onChange,
    rerender: (nextProps: Record<string, any>) =>
      instance.rerender(nextProps as any),
  }
}

describe("ConditionValueControl", () => {
  it("renders all direct value type options", () => {
    renderControl()

    const typeSelect = screen.getByLabelText("Select")
    expect(typeSelect).toHaveTextContent("Text")
    expect(typeSelect).toHaveTextContent("Number")
    expect(typeSelect).toHaveTextContent("Date")
    expect(typeSelect).toHaveTextContent("Boolean")
  })

  it.each([
    [FieldType.STRING, "Condition value", "INPUT", "text"],
    [FieldType.NUMBER, "Value", "INPUT", "number"],
    [FieldType.DATETIME, "Date value", "INPUT", undefined],
    [FieldType.BOOLEAN, "Select", "SELECT", undefined],
  ])(
    "renders the expected direct value control for %s",
    (valueType, label, tagName, inputType) => {
      renderControl({
        value: valueType === FieldType.BOOLEAN ? "true" : "",
        valueType,
      })

      const controls = screen.getAllByLabelText(label)
      const valueControl = controls[controls.length - 1]
      expect(valueControl.tagName).toBe(tagName)
      if (inputType) {
        expect(valueControl).toHaveAttribute("type", inputType)
      }
      if (valueType === FieldType.BOOLEAN) {
        expect(valueControl).toHaveTextContent("True")
        expect(valueControl).toHaveTextContent("False")
      }
    }
  )

  it.each([
    [FieldType.STRING, "hello", "text"],
    [FieldType.NUMBER, "42", "number"],
  ])(
    "dispatches direct %s value updates",
    async (valueType, value, inputType) => {
      const { onBlur, onChange } = renderControl({ valueType })
      const input = screen.getByLabelText(
        valueType === FieldType.NUMBER ? "Value" : "Condition value"
      )

      expect(input).toHaveAttribute("type", inputType)

      await fireEvent.input(input, { target: { value } })
      expect(onChange).toHaveBeenLastCalledWith({ value })

      await fireEvent.blur(input)
      expect(onBlur).toHaveBeenLastCalledWith({ value })
    }
  )

  it("switches from a direct value to a number value type", async () => {
    const { onChange } = renderControl({
      value: "hello",
      valueType: FieldType.STRING,
    })

    await fireEvent.change(screen.getByLabelText("Select"), {
      target: { value: FieldType.NUMBER },
    })

    expect(onChange).toHaveBeenLastCalledWith({
      value: null,
      valueType: FieldType.NUMBER,
    })
  })

  it("initializes boolean direct values to true when switching type", async () => {
    const { onChange } = renderControl({
      value: "hello",
      valueType: FieldType.STRING,
    })

    await fireEvent.change(screen.getByLabelText("Select"), {
      target: { value: FieldType.BOOLEAN },
    })

    expect(onChange).toHaveBeenLastCalledWith({
      value: "true",
      valueType: FieldType.BOOLEAN,
    })
  })

  it("dispatches boolean option changes", async () => {
    const { onChange } = renderControl({
      value: "true",
      valueType: FieldType.BOOLEAN,
    })

    const selects = screen.getAllByLabelText("Select")
    await fireEvent.change(selects[1], { target: { value: "false" } })

    expect(onChange).toHaveBeenLastCalledWith({
      value: "false",
    })
  })

  it.each([
    FieldType.STRING,
    FieldType.NUMBER,
    FieldType.DATETIME,
    FieldType.BOOLEAN,
  ])("renders a free-form value input when %s is a binding", () => {
    renderControl({
      value: "{{ trigger.fields.value }}",
      valueType: "Binding",
    })

    const typeSelect = screen.getByLabelText("Select")
    const input = screen.getByLabelText("Condition value")

    expect(typeSelect).toBeDisabled()
    expect(typeSelect).toHaveTextContent("Text")
    expect(input).toHaveAttribute("type", "text")
    expect(input).toHaveValue("{{ trigger.fields.value }}")
  })

  it.each([
    [FieldType.NUMBER, "Value"],
    [FieldType.DATETIME, "Date value"],
    [FieldType.BOOLEAN, "Select"],
  ])(
    "shows a free-form binding value for %s and restores the typed control when cleared",
    async (valueType, directControlLabel) => {
      const { onChange, rerender } = renderControl({
        value:
          valueType === FieldType.BOOLEAN
            ? "true"
            : valueType === FieldType.NUMBER
              ? "42"
              : "2026-05-01",
        valueType,
      })

      const directControls = screen.getAllByLabelText(directControlLabel)
      expect(directControls[directControls.length - 1]).toBeInTheDocument()
      expect(screen.queryByLabelText("Binding value")).not.toBeInTheDocument()

      await rerender({
        value: "{{ trigger.fields.value }}",
        valueType,
        bindings: [],
      })

      const bindingInput = screen.getByLabelText("Value")
      expect(bindingInput).toHaveValue("{{ trigger.fields.value }}")
      if (valueType === FieldType.BOOLEAN) {
        expect(screen.getAllByLabelText("Select")).toHaveLength(1)
      } else if (valueType === FieldType.NUMBER) {
        expect(bindingInput).toHaveAttribute("type", "text")
      } else {
        expect(
          screen.queryByLabelText(directControlLabel)
        ).not.toBeInTheDocument()
      }

      await fireEvent.click(screen.getByLabelText("x"))
      expect(onChange).toHaveBeenLastCalledWith({
        value: "",
      })

      await rerender({
        value: "",
        valueType,
        bindings: [],
      })

      expect(
        screen.queryByDisplayValue("{{ trigger.fields.value }}")
      ).not.toBeInTheDocument()
      const restoredControls = screen.getAllByLabelText(directControlLabel)
      expect(restoredControls[restoredControls.length - 1]).toBeInTheDocument()
    }
  )

  it("shows a free-form value input for whitespace-only number values", async () => {
    renderControl({
      value: " ",
      valueType: FieldType.NUMBER,
    })

    expect(screen.getByLabelText("Value")).toHaveValue(" ")
  })

  it("supports switching from bindings back to direct values", async () => {
    const { onChange } = renderControl({
      value: "{{ trigger.fields.name }}",
      valueType: "Binding",
    })

    const typeSelect = screen.getByLabelText("Select")
    expect(typeSelect).toBeDisabled()

    const input = screen.getByLabelText("Condition value")
    await fireEvent.input(input, { target: { value: "direct value" } })

    expect(onChange).toHaveBeenLastCalledWith({
      value: "direct value",
    })
  })

  it("can hide the value type selector", () => {
    renderControl({ showTypeSelect: false })

    expect(screen.queryByLabelText("Select")).not.toBeInTheDocument()
    expect(screen.getByLabelText("Condition value")).toBeInTheDocument()
  })
})
