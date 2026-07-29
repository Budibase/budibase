export class DiscordAdapter {
  constructor(config: Record<string, unknown> = {}) {
    Object.assign(this, config)
  }

  protected discordFetch(
    _path: string,
    _method: string,
    _body?: unknown
  ): Promise<Response> {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: async () => ({ id: "msg-1" }),
    } as unknown as Response)
  }

  async postMessage(threadId: string, message: { text?: string }) {
    const channelId = threadId.replace(/^discord:/, "").split(":")[0]
    await this.discordFetch(`/channels/${channelId}/messages`, "POST", {
      content: message?.text ?? "",
    })
    return { id: "msg-1" }
  }

  async getUser(userId: string) {
    await this.discordFetch(`/users/${userId}`, "GET")
    return { id: userId }
  }
}

export const createDiscordAdapter = (opts: Record<string, unknown>) => ({
  ...opts,
})
