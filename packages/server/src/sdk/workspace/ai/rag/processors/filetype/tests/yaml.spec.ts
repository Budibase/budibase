import { yamlProcessor } from "../yaml"

describe("yamlProcessor", () => {
  it("extracts structured chunks from nested yaml", async () => {
    const chunks = await yamlProcessor.process({
      buffer: Buffer.from(`
service:
  name: Customer Support
  region: EMEA
  sla:
    firstResponseMinutes: 15
teams:
  - support-ops
  - security-ops
contacts:
  primary:
    email: support@example.com
      `),
    })

    expect(chunks).toContain(
      [
        "service.name: Customer Support",
        "service.region: EMEA",
        "service.sla.firstResponseMinutes: 15",
      ].join("\n")
    )
    expect(chunks).toContain("teams: support-ops, security-ops")
    expect(chunks).toContain("contacts.primary.email: support@example.com")
  })

  it("falls back to plain chunking for invalid yaml", async () => {
    const content = "not: [valid"

    const chunks = await yamlProcessor.process({
      buffer: Buffer.from(content),
    })

    expect(chunks).toEqual(["not: [valid"])
  })

  it("extracts structured chunks for simple yaml", async () => {
    const content = `
name: Customer Support
region: EMEA
features:
  - case-routing
  - sla-tracking
contacts:
  primary:
    email: support@example.com
    phone: "+33 1 00 00 00 00"
    `

    const chunks = await yamlProcessor.process({
      buffer: Buffer.from(content),
    })

    expect(chunks).toContain("name: Customer Support")
    expect(chunks).toContain("region: EMEA")
    expect(chunks).toContain("features: case-routing, sla-tracking")
    expect(chunks).toContain(
      [
        "contacts.primary.email: support@example.com",
        "contacts.primary.phone: +33 1 00 00 00 00",
      ].join("\n")
    )
  })

  it("handles circular yaml aliases without overflowing the stack", async () => {
    const chunks = await yamlProcessor.process({
      buffer: Buffer.from(`
node: &node
  name: root
  self: *node
      `),
    })

    expect(chunks).toContain("node.name: root\nnode.self: [Circular]")
  })

  it("does not flatten tagged yaml values as empty objects", async () => {
    const chunks = await yamlProcessor.process({
      buffer: Buffer.from(`
ts: !!timestamp 2020-01-02T03:04:05Z
set: !!set
  ? red
  ? blue
      `),
    })

    const text = chunks.join("\n")
    expect(text).toContain("ts: ")
    expect(text).toContain("set: [object Set]")
    expect(text).not.toContain("ts: {}")
    expect(text).not.toContain("set: {}")
  })
})
