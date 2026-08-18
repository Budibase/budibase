import { withClampedMentions } from "./discordAdapter"

// The mention policy itself - a pure payload transform, so it's checked
// directly rather than through the adapter. (The adapter is ESM-only and
// redirected by moduleNameMapper, so a subclass test could only ever exercise
// a hand-written mock; the subclass is four thin delegations to this.)
describe("withClampedMentions", () => {
  it("clamps mentions on a content payload", () => {
    expect(withClampedMentions({ content: "Fuel for @here" })).toEqual({
      content: "Fuel for @here",
      allowed_mentions: { parse: [] },
    })
  })

  it("clamps mentions on an embeds-only payload", () => {
    const embeds = [{ description: "@everyone" }]
    expect(withClampedMentions({ embeds })).toEqual({
      embeds,
      allowed_mentions: { parse: [] },
    })
  })

  it("leaves the message text untouched", () => {
    const clamped = withClampedMentions({
      content: "Notes: Fuel for @here bongos",
    }) as { content: string }
    expect(clamped.content).toEqual("Notes: Fuel for @here bongos")
  })

  it("lets a deliberate caller policy win", () => {
    const caller = { parse: [], users: ["222222222222222222"] }
    expect(
      withClampedMentions({ content: "hi", allowed_mentions: caller })
    ).toEqual({ content: "hi", allowed_mentions: caller })
  })

  it.each([
    ["a non-message body", { channel_id: "1" }],
    ["a non-object", "raw string"],
    ["undefined", undefined],
    ["null", null],
  ])("passes through %s unchanged", (_label, input) => {
    expect(withClampedMentions(input)).toEqual(input)
  })
})
