import { render, screen } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"
import FunctionTrustNotice from "./FunctionTrustNotice.svelte"

describe("Function trusted author warning", () => {
  it("explains the credentialed worker and native failure boundary", () => {
    render(FunctionTrustNotice)
    const warning = screen.getByLabelText(
      "Functions alpha trusted author warning"
    )
    expect(warning).toHaveTextContent(
      "application credentials and network access"
    )
    expect(warning).toHaveTextContent(
      "An isolate escape could expose credentials"
    )
    expect(warning).toHaveTextContent("native crash could stop the worker")
    expect(warning).toHaveTextContent(
      "people you trust to write JavaScript automations"
    )
  })
})
