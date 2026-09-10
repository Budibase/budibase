import { describe, expect, it } from "vitest"

import { renderMarkdown } from "./renderMarkdown"

describe("renderMarkdown", () => {
  it("preserves safe HTML used for email layouts", () => {
    const html = renderMarkdown(
      '<div style="color:red;padding:4px"><span>Alert</span><table width="600" cellpadding="4"><tr><td colspan="2">Body</td></tr></table></div>'
    )

    expect(html).toBe(
      '<div style="color:red;padding:4px"><span>Alert</span><table width="600" cellpadding="4"><tr><td colspan="2">Body</td></tr></table></div>'
    )
  })

  it("blocks the stored XSS advisory payload", () => {
    const html = renderMarkdown(
      '<iframe srcdoc="<script src=https://example.com/payload.mjs></script>"></iframe>'
    )

    expect(html).toBe("")
  })

  it("removes executable attributes, URLs, and styles", () => {
    const html = renderMarkdown(
      '<div class="spectrum-Modal" onclick="alert(1)" style="color:red;position:fixed;background-image:url(https://example.com/pixel)"><img src="https://example.com/image.png" onerror="alert(1)"><a href="javascript:alert(1)">Link</a></div>'
    )

    expect(html).toBe(
      '<div style="color:red"><img src="https://example.com/image.png" /><a>Link</a></div>'
    )
  })

  it("removes unsafe values from allowed style properties", () => {
    const html = renderMarkdown(
      '<div style="color:url(https://example.com/x);width:expression(alert(1));padding:4px">Direct</div><div style="color:u\\72l(https://example.com/x);width:e\\78pression(alert(1));font-family:u/**/rl(https://example.com/x);padding:4px">Obfuscated</div>'
    )

    expect(html).toBe(
      '<div style="padding:4px">Direct</div><div style="padding:4px">Obfuscated</div>'
    )
  })
})
