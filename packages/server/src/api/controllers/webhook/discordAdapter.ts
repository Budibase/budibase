import {
  DiscordAdapter,
  type DiscordAdapterConfig,
} from "@chat-adapter/discord"

type DiscordFile = {
  filename: string
  data: Buffer | Blob | ArrayBuffer
  mimeType?: string
}

// Agent replies quote stored data, which can contain "@everyone"/"@here".
// Matches on shape rather than method/path, so it covers channel posts,
// interaction callbacks and the PATCH that edits a deferred slash reply.
// Exported so the policy is testable without loading the ESM-only adapter.
export const withClampedMentions = (body: unknown) => {
  if (!body || typeof body !== "object") {
    return body
  }
  const record = body as Record<string, unknown>
  if (!("content" in record) && !("embeds" in record)) {
    return body
  }
  // Spread ours first so a deliberate caller-supplied policy still wins.
  return { allowed_mentions: { parse: [] }, ...record }
}

class SafeDiscordAdapter extends DiscordAdapter {
  protected discordFetch(
    path: string,
    method: string,
    body?: unknown
  ): Promise<Response> {
    return super.discordFetch(path, method, withClampedMentions(body))
  }

  protected discordInteractionFetch(
    path: string,
    method: string,
    body?: unknown
  ): Promise<Response> {
    return super.discordInteractionFetch(
      path,
      method,
      withClampedMentions(body)
    )
  }

  // The file variants call fetch() directly, bypassing both methods above.
  protected postMessageWithFiles(
    channelId: string,
    threadId: string,
    payload: Parameters<DiscordAdapter["postMessageWithFiles"]>[2],
    files: DiscordFile[]
  ) {
    return super.postMessageWithFiles(
      channelId,
      threadId,
      withClampedMentions(payload) as typeof payload,
      files
    )
  }

  protected discordInteractionFetchWithFiles(
    path: string,
    method: string,
    payload: Parameters<DiscordAdapter["discordInteractionFetchWithFiles"]>[2],
    files: DiscordFile[]
  ) {
    return super.discordInteractionFetchWithFiles(
      path,
      method,
      withClampedMentions(payload) as typeof payload,
      files
    )
  }
}

export const createSafeDiscordAdapter = (config: DiscordAdapterConfig) =>
  new SafeDiscordAdapter(config)
