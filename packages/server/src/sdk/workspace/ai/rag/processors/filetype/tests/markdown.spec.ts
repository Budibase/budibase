import { markdownProcessor } from "../markdown"

describe("markdownProcessor", () => {
  it("preserves heading context for list facts", async () => {
    const chunks = await markdownProcessor.process({
      buffer: Buffer.from(`
# Product Support Knowledge Base

## Account Management

### Password Reset Policy
- Users can reset passwords from the account security page.
- Password reset links expire after 30 minutes.
      `),
    })

    expect(chunks).toEqual([
      [
        "Product Support Knowledge Base > Account Management > Password Reset Policy",
        "Users can reset passwords from the account security page.",
      ].join("\n"),
      [
        "Product Support Knowledge Base > Account Management > Password Reset Policy",
        "Password reset links expire after 30 minutes.",
      ].join("\n"),
    ])
  })

  it("keeps formatted heading text in context", async () => {
    const chunks = await markdownProcessor.process({
      buffer: Buffer.from(`
## The **Incident Response** Runbook \`v2\`

- Escalation path: Security Operations
      `),
    })

    expect(chunks).toEqual([
      [
        "The **Incident Response** Runbook `v2`",
        "Escalation path: Security Operations",
      ].join("\n"),
    ])
  })

  it("turns markdown tables into retrievable facts", async () => {
    const chunks = await markdownProcessor.process({
      buffer: Buffer.from(`
## Regional Offices

| Location | Description |
|---|---|
| Paris | European support and compliance operations |
| New York | North American customer success operations |
      `),
    })

    expect(chunks).toEqual([
      "Regional Offices\nLocation: Paris; Description: European support and compliance operations",
      "Regional Offices\nLocation: New York; Description: North American customer success operations",
    ])
  })

  it("keeps nested list items with their parent fact", async () => {
    const chunks = await markdownProcessor.process({
      buffer: Buffer.from(`
## Incident Steps

- Primary runbook step
  - Nested detail one
  - Nested detail two
- Secondary step
      `),
    })

    expect(chunks).toEqual([
      [
        "Incident Steps",
        [
          "Primary runbook step:",
          "- Nested detail one",
          "- Nested detail two",
        ].join("\n"),
      ].join("\n"),
      ["Incident Steps", "Secondary step"].join("\n"),
    ])
  })
})
