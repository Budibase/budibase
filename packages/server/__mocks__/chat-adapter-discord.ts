type DiscordFile = {
  filename: string
  data: Buffer | Blob | ArrayBuffer
  mimeType?: string
}

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

  protected discordInteractionFetch(
    path: string,
    method: string,
    body?: unknown
  ): Promise<Response> {
    return this.discordFetch(path, method, body)
  }

  protected async postMessageWithFiles(
    channelId: string,
    _threadId: string,
    payload: unknown,
    _files: DiscordFile[]
  ) {
    await this.discordFetch(`/channels/${channelId}/messages`, "POST", payload)
    return { id: "msg-1" }
  }

  protected discordInteractionFetchWithFiles(
    path: string,
    method: string,
    payload: unknown,
    _files: DiscordFile[]
  ): Promise<Response> {
    return this.discordFetch(path, method, payload)
  }
}

export const createDiscordAdapter = (opts: Record<string, unknown>) => ({
  ...opts,
})
