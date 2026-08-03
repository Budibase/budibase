import { render, waitFor } from "@testing-library/svelte"
import { beforeEach, describe, expect, it } from "vitest"
import FunctionCodeEditor from "./FunctionCodeEditor.svelte"

describe("FunctionCodeEditor", () => {
  beforeEach(() => {
    document.body.className = "spectrum"
  })

  it("renders TypeScript source and located compiler diagnostics", async () => {
    const view = render(FunctionCodeEditor, {
      value: "const broken: string = 42",
      diagnostics: [
        {
          code: "TS2322",
          message: "Type 'number' is not assignable to type 'string'.",
          line: 1,
          column: 7,
        },
      ],
    })

    expect(view.container).toHaveTextContent("const broken: string = 42")
    await waitFor(() => {
      expect(
        view.container.querySelector(".cm-lintRange-error")
      ).toBeInTheDocument()
    })
  })
})
