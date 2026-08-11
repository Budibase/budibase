import { fireEvent, render } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import MockSlot from "@/test/mocks/MockSlot.svelte"
import MockDraggableList from "./tests/MockDraggableList.svelte"

const mocks = vi.hoisted(() => ({
  uuid: vi.fn(() => crypto.randomUUID()),
}))

vi.mock("@budibase/bbui", () => ({
  Helpers: {
    uuid: mocks.uuid,
  },
  Menu: MockSlot,
  MenuItem: MockSlot,
  Popover: MockSlot,
}))

vi.mock("../DraggableList.svelte", () => ({
  default: MockDraggableList,
}))

vi.mock("@/dataBinding", () => ({
  getEventContextBindings: () => [],
}))

vi.mock("@/stores/builder", () => ({
  componentStore: {
    createInstance: vi.fn(),
  },
}))

vi.mock("@/templates/rowActions", () => ({
  getRowActionButtonTemplates: vi.fn(),
}))

import ButtonConfiguration from "./ButtonConfiguration.svelte"

describe("ButtonConfiguration", () => {
  it("duplicates a button immediately after the original with fresh identifiers", async () => {
    const buttonSettings = [
      {
        _component: "@budibase/standard-components/button",
        _id: "button-one",
        _instanceName: "First button",
        text: "First",
      },
      {
        _component: "@budibase/standard-components/button",
        _id: "button-two",
        _instanceName: "Second button",
        text: "Second",
      },
    ]
    const onChange = vi.fn()
    const { getByRole } = render(ButtonConfiguration, {
      props: {
        bindings: [],
        componentBindings: [],
        componentInstance: {},
        key: "buttons",
        value: buttonSettings,
      },
      events: {
        change: event => onChange(event.detail),
      },
    })

    await fireEvent.click(getByRole("button", { name: "Copy First button" }))

    const duplicatedSettings = onChange.mock.calls[0][0]

    expect(duplicatedSettings).not.toBe(buttonSettings)
    expect(duplicatedSettings[0]).toMatchObject(buttonSettings[0])
    expect(duplicatedSettings[2]).toMatchObject(buttonSettings[1])
    expect(duplicatedSettings[1]._id).not.toBe(buttonSettings[0]._id)
    expect(duplicatedSettings[1]._instanceName).not.toBe(
      buttonSettings[0]._instanceName
    )
    expect(duplicatedSettings[1]).toMatchObject({
      _component: buttonSettings[0]._component,
      text: buttonSettings[0].text,
    })
  })
})
