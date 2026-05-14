import { describe, expect, it } from "vitest"

import { renderMarkdown } from "./renderMarkdown"

describe("renderMarkdown", () => {
  it("renders standard markdown", () => {
    expect(
      renderMarkdown("## Title\n\n[Docs](https://docs.budibase.com)")
    ).toBe(
      '<h2 id="title">Title</h2>\n<p><a href="https://docs.budibase.com">Docs</a></p>\n'
    )
  })

  it("strips raw HTML", () => {
    expect(
      renderMarkdown('<iframe srcdoc="<script>alert(1)</script>"></iframe>')
    ).toBe("")
  })

  it("removes unsafe link and image targets", () => {
    const html = renderMarkdown(
      "[link](javascript:alert(1))\n\n![image](javascript:alert(1))"
    )

    expect(html).toBe("<p>link</p>\n<p>image</p>\n")
  })

  it("removes relative link and image targets", () => {
    const html = renderMarkdown(
      "[relative](/path)\n\n[protocol-relative](//example.com/path)\n\n![image](/image.png)"
    )

    expect(html).toBe(
      "<p>relative</p>\n<p>protocol-relative</p>\n<p>image</p>\n"
    )
  })
})
