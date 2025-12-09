import { describe, it, expect, vi, afterEach } from "vitest"
import { createAPIClient } from "@budibase/frontend-core"
import type { AgentChat } from "@budibase/types"

const chat: AgentChat = {
  title: "Test chat",
  messages: [],
}

const createStreamResponse = (sse: string) =>
  new Response(sse, {
    status: 200,
    headers: { "Content-Type": "text/event-stream" },
  })

const drainStream = async (stream: AsyncIterable<unknown>) => {
  for await (const _ of stream) {
    // drain
  }
}

describe("agentChatStream error handling", () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it("throws when the stream emits an error chunk with text", async () => {
    const fetchMock = vi.fn(async () =>
      createStreamResponse(
        'data: {"type":"error","errorText":"Custom agent failure"}\n'
      )
    )
    vi.stubGlobal("fetch", fetchMock)

    const api = createAPIClient()

    await expect(async () => {
      const stream = await api.agentChatStream(chat, "workspace-123")
      await drainStream(stream)
    }).rejects.toThrow("Custom agent failure")
  })

  it("falls back to a default message when no errorText is provided", async () => {
    const fetchMock = vi.fn(async () =>
      createStreamResponse('data: {"type":"error"}\n')
    )
    vi.stubGlobal("fetch", fetchMock)

    const api = createAPIClient()

    await expect(async () => {
      const stream = await api.agentChatStream(chat, "workspace-123")
      await drainStream(stream)
    }).rejects.toThrow("Agent action failed")
  })
})
