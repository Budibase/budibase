import { markdownProcessor } from "../markdown"

describe("markdownProcessor", () => {
  it("preserves heading context for list facts", async () => {
    const chunks = await markdownProcessor.process({
      buffer: Buffer.from(`
# SpongeBob SquarePants Trivia

## Characters

### SpongeBob SquarePants
- His address is 124 Conch Street.
- He has a pet snail named Gary.
      `),
    })

    expect(chunks).toContain(
      [
        "SpongeBob SquarePants Trivia > Characters > SpongeBob SquarePants",
        "His address is 124 Conch Street.",
        "SpongeBob SquarePants Trivia > Characters > SpongeBob SquarePants",
        "He has a pet snail named Gary.",
      ].join("\n")
    )
  })

  it("keeps formatted heading text in context", async () => {
    const chunks = await markdownProcessor.process({
      buffer: Buffer.from(`
## The **Krusty Krab** Menu \`v2\`

- Signature item: Krabby Patty
      `),
    })

    expect(chunks).toContain(
      ["The Krusty Krab Menu v2", "Signature item: Krabby Patty"].join("\n")
    )
  })

  it("turns markdown tables into retrievable facts", async () => {
    const chunks = await markdownProcessor.process({
      buffer: Buffer.from(`
## Locations in Bikini Bottom

| Location | Description |
|---|---|
| Krusty Krab | SpongeBob and Squidward's workplace |
| Goo Lagoon | Bikini Bottom's beach and recreational area |
      `),
    })

    expect(chunks).toContain(
      [
        "Locations in Bikini Bottom",
        "Location: Krusty Krab; Description: SpongeBob and Squidward's workplace",
      ].join("\n")
    )
    expect(chunks).toContain(
      [
        "Locations in Bikini Bottom",
        "Location: Goo Lagoon; Description: Bikini Bottom's beach and recreational area",
      ].join("\n")
    )
  })
})
