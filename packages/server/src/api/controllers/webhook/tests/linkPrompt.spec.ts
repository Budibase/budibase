import {
  buildPlainTextLinkPrompt,
  postLinkPromptPrivately,
} from "../linkPrompt"

describe("link prompt helpers", () => {
  it("builds a plain text prompt with the handoff URL", () => {
    expect(
      buildPlainTextLinkPrompt({
        text: "Link your account to continue.",
        linkUrl: "https://example.com/handoff",
      })
    ).toEqual("Link your account to continue.\nhttps://example.com/handoff")
  })

  it("sends plain text privately when requested", async () => {
    const postEphemeral = jest.fn(async () => ({ usedFallback: true }))

    const result = await postLinkPromptPrivately({
      target: {
        post: jest.fn(),
        postEphemeral,
      },
      user: "telegram-user",
      text: "Link your account to continue.",
      linkUrl: "https://example.com/handoff",
      renderMode: "plainText",
    })

    expect(postEphemeral).toHaveBeenCalledWith(
      "telegram-user",
      "Link your account to continue.\nhttps://example.com/handoff",
      {
        fallbackToDM: true,
      }
    )
    expect(result).toEqual({
      delivered: true,
      usedDirectMessageFallback: true,
    })
  })
})
