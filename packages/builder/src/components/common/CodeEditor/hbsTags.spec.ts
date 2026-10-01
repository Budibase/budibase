import { EditorState } from "@codemirror/state"
import { EditorView } from "@codemirror/view"
import { describe, expect, it } from "vitest"
import { hbsTagPlugin } from "./hbsTags"

describe("hbsTagPlugin", () => {
  it("renders retired namespace bindings as unsupported tools", () => {
    const parent = document.createElement("div")
    const state = EditorState.create({
      doc: "{{ escalation.request }}",
      extensions: [hbsTagPlugin({}, new Set(["budibase.valid_tool"]))],
    })
    const view = new EditorView({ state, parent })

    const tag = parent.querySelector(".hbs-tag")
    expect(tag?.classList.contains("hbs-tag--error")).toBe(true)
    expect(tag?.textContent).toEqual("escalation.request")

    view.destroy()
  })
})
