// @vitest-environment jsdom

import { mount, unmount } from "svelte"
import { writable } from "svelte/store"
import { afterEach, describe, expect, it, vi } from "vitest"
import Button from "./Button.svelte"

let mounted = []

const renderButtons = (buttons, mobile) => {
  const target = document.createElement("div")
  target.style.display = "flex"
  target.style.flexWrap = "wrap"
  target.style.width = "320px"
  document.body.append(target)
  const components = buttons.map(props =>
    mount(Button, {
      target,
      props,
      context: new Map([
        [
          "sdk",
          {
            styleable: () => {},
            builderStore: writable({}),
          },
        ],
        [
          "component",
          writable({
            editing: false,
            name: "Button",
            styles: {},
          }),
        ],
        ["context", writable({ device: { mobile } })],
      ]),
    })
  )
  mounted.push({ components, target })
  return target
}

const renderButton = (props, mobile) => renderButtons([props], mobile)

afterEach(async () => {
  await Promise.all(
    mounted.map(async ({ components, target }) => {
      await Promise.all(components.map(component => unmount(component)))
      target.remove()
    })
  )
  mounted = []
})

describe("Button full width on mobile", () => {
  it("does not enable full width when the setting is missing", () => {
    const target = renderButton({ text: "Save" }, true)

    expect(
      target.querySelector("button").classList.contains("full-width-mobile")
    ).toBe(false)
  })

  it("stretches configured buttons on mobile but not on desktop", () => {
    const mobile = renderButton(
      { text: "Save", fullWidthOnMobile: true },
      true
    )
    const desktop = renderButton(
      { text: "Save", fullWidthOnMobile: true },
      false
    )

    expect(
      mobile.querySelector("button").classList.contains("full-width-mobile")
    ).toBe(true)
    expect(
      desktop.querySelector("button").classList.contains("full-width-mobile")
    ).toBe(false)
  })

  it(
    "allows multiple configured actions to wrap as full-width mobile buttons",
    () => {
      const target = renderButtons(
        [
          { text: "Save", fullWidthOnMobile: true },
          { text: "Cancel", fullWidthOnMobile: true },
        ],
        true
      )
      const buttons = [...target.querySelectorAll("button")]

      expect(buttons).toHaveLength(2)
      expect(
        buttons.every(button => button.classList.contains("full-width-mobile"))
      ).toBe(true)
      expect(target.style.flexWrap).toBe("wrap")
    }
  )

  it("preserves button variants, disabled state, and click behavior", async () => {
    const onClick = vi.fn()
    const target = renderButton(
      {
        text: "Save",
        fullWidthOnMobile: true,
        type: "primary",
        onClick,
      },
      true
    )
    const saveButton = target.querySelector("button")

    expect(saveButton.classList.contains("spectrum-Button--primary")).toBe(
      true
    )
    expect(saveButton.classList.contains("full-width-mobile")).toBe(true)

    saveButton.click()
    await Promise.resolve()

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("retains the disabled state for a full-width mobile button", () => {
    const target = renderButton(
      {
        text: "Unavailable",
        fullWidthOnMobile: true,
        disabled: true,
      },
      true
    )
    const button = target.querySelector("button")

    expect(button.disabled).toBe(true)
    expect(button.classList.contains("full-width-mobile")).toBe(true)
  })
})
