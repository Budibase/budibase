// @vitest-environment jsdom

import { describe, expect, it } from "vitest"
import {
  getCustomToolbarIconNames,
  toolbarIcons,
  useLocalToolbarIcons,
} from "./toolbarIcons"

describe("toolbar icons", () => {
  it("maps every EasyMDE toolbar button", () => {
    expect(Object.keys(toolbarIcons)).toEqual(
      expect.arrayContaining([
        "bold",
        "italic",
        "strikethrough",
        "heading",
        "heading-smaller",
        "heading-bigger",
        "heading-1",
        "heading-2",
        "heading-3",
        "code",
        "quote",
        "unordered-list",
        "ordered-list",
        "clean-block",
        "link",
        "image",
        "upload-image",
        "table",
        "horizontal-rule",
        "preview",
        "side-by-side",
        "fullscreen",
        "guide",
        "undo",
        "redo",
      ])
    )
  })

  it("preserves icons supplied by a custom toolbar", () => {
    const toolbarElements = {
      bold: document.createElement("button"),
      italic: document.createElement("button"),
    }
    toolbarElements.bold.appendChild(document.createElement("i"))
    toolbarElements.italic.appendChild(document.createElement("i"))
    const customIcons = getCustomToolbarIconNames({
      toolbar: ["bold", { name: "italic", className: "custom-italic" }],
    })

    useLocalToolbarIcons({ toolbarElements }, customIcons)

    expect(toolbarElements.bold.querySelector("i")?.className).toBe(
      "ph ph-bold ph-text-b"
    )
    expect(toolbarElements.italic.querySelector("i")?.className).toBe("")
  })
})
