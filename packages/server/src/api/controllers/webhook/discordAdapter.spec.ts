import { createSafeDiscordAdapter } from "./discordAdapter"

// The adapter builds its own Discord payloads and offers no mention option, so
// the clamp is applied by overriding the protected discordFetch every outbound
// call funnels through. These tests pin that assumption - if a future adapter
// version stops routing sends through discordFetch, they fail rather than
// silently letting mentions through again.
describe("createSafeDiscordAdapter", () => {
  const buildAdapter = () => {
    const adapter = createSafeDiscordAdapter({
      applicationId: "app-id",
      publicKey: "public-key",
      botToken: "bot-token",
    })
    const calls: { path: string; method: string; body: any }[] = []
    // Stand in for the real network call one level below our override.
    const proto = Object.getPrototypeOf(Object.getPrototypeOf(adapter))
    jest
      .spyOn(proto, "discordFetch")
      .mockImplementation((...args: unknown[]) => {
        const [path, method, body] = args as [string, string, any]
        calls.push({ path, method, body })
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ id: "msg-1" }),
        } as unknown as Response)
      })
    return { adapter, calls }
  }

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("clamps mentions on message posts", async () => {
    const { adapter, calls } = buildAdapter()

    await adapter.postMessage("discord:123456789012345678", {
      text: "Updated the note: Fuel for @here",
    } as any)

    const post = calls.find(
      call => call.method === "POST" && call.path.includes("/messages")
    )
    expect(post).toBeDefined()
    expect(post!.body.allowed_mentions).toEqual({ parse: [] })
    // The text itself is untouched - we defuse the mention, not the message.
    expect(post!.body.content).toContain("@here")
  })

  it("leaves non-message requests alone", async () => {
    const { adapter, calls } = buildAdapter()

    await adapter.getUser("222222222222222222").catch(() => {})

    for (const call of calls) {
      if (!call.path.includes("/messages")) {
        expect(call.body?.allowed_mentions).toBeUndefined()
      }
    }
  })
})
