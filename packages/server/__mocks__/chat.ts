import crypto from "crypto"

type AnyFn = (...args: any[]) => any
type MockProvider = "slack" | "teams"
type MockPostEphemeralResult = { usedFallback: boolean }

interface MockCardElement {
  type: string
  [key: string]: unknown
}

interface ChatOptions {
  userName?: string
  adapters?: Record<string, unknown>
  state?: unknown
  logger?: string
}

const defaultPostEphemeralResult = (): MockPostEphemeralResult => ({
  usedFallback: false,
})

const mockWebhookState: Record<MockProvider, MockPostEphemeralResult> = {
  slack: defaultPostEphemeralResult(),
  teams: defaultPostEphemeralResult(),
}

const toMessageText = (value: unknown) =>
  typeof value === "string" ? value : JSON.stringify(value)

const createMessageCollector = (
  provider: MockProvider,
  messages: string[]
) => ({
  post: async (message: unknown) => {
    messages.push(toMessageText(message))
  },
  postEphemeral: async (
    _user: unknown,
    message: unknown,
    _options: { fallbackToDM: boolean }
  ) => {
    const result = mockWebhookState[provider]
    if (!result.usedFallback) {
      messages.push(toMessageText(message))
    }
    return result
  },
})

interface MockSlackEvent {
  type?: string
  channel?: string
  channel_type?: string
  text?: string
  thread_ts?: string
  ts?: string
  user?: string
  username?: string
}

interface MockTeamsMentionEntity {
  type?: string
  mentioned?: {
    id?: string
  }
}

interface MockTeamsActivity {
  type?: string
  text?: string
  threadId?: string
  recipient?: {
    id?: string
  }
  conversation?: {
    id?: string
    conversationType?: string
  }
  from?: {
    id?: string
    name?: string
  }
  entities?: MockTeamsMentionEntity[]
}

const isSlackDirectMessage = (event: MockSlackEvent) =>
  event.channel_type === "im" || !!event.channel?.startsWith("D")

const isSlackMentionMessage = (event: MockSlackEvent) =>
  /<@[A-Z0-9]+(?:\|[^>]+)?>/i.test(event.text || "")

const isTeamsMentionActivity = (activity: MockTeamsActivity) => {
  const recipientId = activity.recipient?.id?.trim()
  if (!recipientId) {
    return false
  }

  return (activity.entities || []).some(
    entity =>
      entity.type?.toLowerCase() === "mention" &&
      entity.mentioned?.id?.trim() === recipientId
  )
}

const invokeHandlers = async (
  handlers: AnyFn[],
  thread: unknown,
  message: unknown
) => {
  for (const handler of handlers) {
    await handler(thread, message)
  }
}

export const resetMockChatState = () => {
  mockWebhookState.slack = defaultPostEphemeralResult()
  mockWebhookState.teams = defaultPostEphemeralResult()
}

export const setMockPostEphemeralResult = (
  provider: MockProvider,
  result: MockPostEphemeralResult
) => {
  mockWebhookState[provider] = result
}

export class ConsoleLogger {
  level: string

  constructor(level: string) {
    this.level = level
  }
}

export class Chat {
  slashHandlers = new Map<string, AnyFn>()
  mentionHandlers: AnyFn[] = []
  directMessageHandlers: AnyFn[] = []
  newMessageHandlers: AnyFn[] = []
  subscribedHandlers: AnyFn[] = []
  installationHandlers = new Map<string, AnyFn>()
  adapters: Record<string, unknown>

  webhooks: {
    discord: (request: Request) => Promise<Response>
    teams: (request: Request) => Promise<Response>
    slack: (request: Request) => Promise<Response>
  }

  constructor(_options: ChatOptions) {
    this.adapters = _options.adapters || {}
    const discordPublicKey = String(
      (_options.adapters?.discord as { publicKey?: string } | undefined)
        ?.publicKey || ""
    )
    this.webhooks = {
      discord: async request => {
        const rawBody = await request.text()
        const signature = request.headers.get("x-signature-ed25519")
        const timestamp = request.headers.get("x-signature-timestamp")

        if (!signature || !timestamp) {
          return new Response(
            JSON.stringify({ error: "Missing Discord signature headers" }),
            {
              status: 401,
              headers: { "content-type": "application/json" },
            }
          )
        }

        const signedPayload = new Uint8Array(
          Buffer.from(`${timestamp}${rawBody}`, "utf8")
        )
        const keyPrefix = new Uint8Array(
          Buffer.from("302a300506032b6570032100", "hex")
        )
        const publicKeyBytes = new Uint8Array(
          Buffer.from(discordPublicKey, "hex")
        )
        const key = new Uint8Array(keyPrefix.length + publicKeyBytes.length)
        key.set(keyPrefix, 0)
        key.set(publicKeyBytes, keyPrefix.length)
        const verified = crypto.verify(
          null,
          signedPayload,
          { key: Buffer.from(key), format: "der", type: "spki" },
          new Uint8Array(Buffer.from(signature, "hex"))
        )
        if (!verified) {
          return new Response(
            JSON.stringify({ error: "Invalid Discord signature" }),
            {
              status: 401,
              headers: { "content-type": "application/json" },
            }
          )
        }

        let parsed: Record<string, unknown> | undefined
        try {
          parsed = JSON.parse(rawBody) as Record<string, unknown>
        } catch {
          parsed = undefined
        }

        if (parsed?.type === 1) {
          return new Response(JSON.stringify({ type: 1 }), {
            status: 200,
            headers: { "content-type": "application/json" },
          })
        }

        return new Response("", { status: 200 })
      },
      teams: async request => {
        const auth = request.headers.get("authorization")
        if (!auth) {
          return new Response(
            JSON.stringify({
              "jwt-auth-error": "authorization header not found",
            }),
            {
              status: 401,
              headers: { "content-type": "application/json" },
            }
          )
        }
        if (auth !== "Bearer valid-token") {
          return new Response(
            JSON.stringify({ "jwt-auth-error": "invalid token" }),
            {
              status: 401,
              headers: { "content-type": "application/json" },
            }
          )
        }

        const body = (await request.json()) as MockTeamsActivity
        if (body.type !== "message") {
          return new Response(JSON.stringify({}), {
            status: 200,
            headers: { "content-type": "application/json" },
          })
        }

        const messages: string[] = []
        const thread = {
          id: body.threadId || body.conversation?.id || "teams:thread-1",
          ...createMessageCollector("teams", messages),
          subscribe: async () => {},
        }
        const isMention = isTeamsMentionActivity(body)
        const message = {
          text: body.text || "",
          raw: body,
          isMention,
          author: {
            userId: body.from?.id || "",
            fullName: body.from?.name,
          },
        }

        if (body.conversation?.conversationType === "personal") {
          await invokeHandlers(this.directMessageHandlers, thread, message)
        } else {
          if (isMention) {
            await invokeHandlers(this.mentionHandlers, thread, message)
          } else {
            await invokeHandlers(this.subscribedHandlers, thread, message)
          }
          await invokeHandlers(this.newMessageHandlers, thread, message)
        }

        return new Response(JSON.stringify({ messages }), {
          status: 200,
          headers: { "content-type": "application/json" },
        })
      },
      slack: async request => {
        const body = await request.json()
        const command = typeof body?.command === "string" ? body.command : ""
        const slashHandler = this.slashHandlers.get(command)

        if (slashHandler) {
          const messages: string[] = []
          const channel = createMessageCollector("slack", messages)
          await slashHandler({
            command,
            text: body?.text || "",
            raw: {
              channel: body?.channel_id,
              channel_id: body?.channel_id,
              user: body?.user_id,
              user_id: body?.user_id,
              team_id: body?.team_id,
            },
            user: {
              userId: body?.user_id || "",
              userName: body?.user_name || body?.user_id || "",
              fullName: body?.user_name || body?.user_id || "",
            },
            channel,
          })

          return new Response(JSON.stringify({ messages }), {
            status: 200,
            headers: { "content-type": "application/json" },
          })
        }

        const event = (body?.event || {}) as MockSlackEvent
        if (body?.type !== "event_callback" || event?.type !== "message") {
          return new Response(JSON.stringify({ messages: [] }), {
            status: 200,
            headers: { "content-type": "application/json" },
          })
        }

        const messages: string[] = []
        const channelId = event.channel || ""
        const threadTs =
          event.channel_type === "im"
            ? event.thread_ts || ""
            : event.thread_ts || event.ts || ""
        const channel = {
          id: `slack:${channelId}`,
          ...createMessageCollector("slack", messages),
        }
        const thread = {
          id: `slack:${channelId}:${threadTs}`,
          channelId,
          ...createMessageCollector("slack", messages),
          subscribe: async () => {},
          channel,
        }
        const isMention = isSlackMentionMessage(event)
        const message = {
          text: event.text || "",
          raw: event,
          isMention,
          author: {
            userId: event.user || "",
            userName: event.username || event.user || "",
            fullName: event.username || event.user || "",
          },
        }

        if (isSlackDirectMessage(event)) {
          await invokeHandlers(this.newMessageHandlers, thread, message)
        } else {
          if (isMention) {
            await invokeHandlers(this.mentionHandlers, thread, message)
          } else if (event.thread_ts) {
            await invokeHandlers(this.subscribedHandlers, thread, message)
          }
          await invokeHandlers(this.newMessageHandlers, thread, message)
        }

        return new Response(JSON.stringify({ messages }), {
          status: 200,
          headers: { "content-type": "application/json" },
        })
      },
    }
  }

  onSlashCommand(command: string | string[], handler: AnyFn) {
    const commands = Array.isArray(command) ? command : [command]
    for (const cmd of commands) {
      this.slashHandlers.set(cmd, handler)
    }
  }

  onNewMention(handler: AnyFn) {
    this.mentionHandlers.push(handler)
  }

  onDirectMessage(handler: AnyFn) {
    this.directMessageHandlers.push(handler)
  }

  onSubscribedMessage(handler: AnyFn) {
    this.subscribedHandlers.push(handler)
  }

  onNewMessage(_pattern: unknown, handler: AnyFn) {
    this.newMessageHandlers.push(handler)
  }

  onInstallationUpdate(action: string, handler: AnyFn) {
    this.installationHandlers.set(action, handler)
  }

  getAdapter(name: string) {
    return this.adapters[name]
  }
}

export const Card = (
  options: Record<string, unknown> = {}
): MockCardElement => ({
  type: "card",
  ...options,
})

export const CardText = (text: string): MockCardElement => ({
  type: "text",
  text,
})

export const Actions = (children: unknown[]): MockCardElement => ({
  type: "actions",
  children,
})

export const LinkButton = (
  options: Record<string, unknown>
): MockCardElement => ({
  type: "link_button",
  ...options,
})

export const CardLink = (
  options: Record<string, unknown>
): MockCardElement => ({
  type: "card_link",
  ...options,
})

export interface Message {
  text?: string
  raw?: unknown
  isMention?: boolean
  author: {
    userId: string
    fullName?: string
    userName?: string
  }
}

export interface Thread {
  id?: string
  channelId?: string
  channel?: {
    id?: string
    post: (message: string | MockCardElement) => Promise<void>
    postEphemeral?: (
      user: string | { userId?: string },
      message: string | MockCardElement,
      options: { fallbackToDM: boolean }
    ) => Promise<{ usedFallback: boolean } | null>
  }
  post: (message: string | MockCardElement) => Promise<void>
  subscribe?: () => Promise<void>
  postEphemeral?: (
    user: string | { userId?: string },
    message: string | MockCardElement,
    options: { fallbackToDM: boolean }
  ) => Promise<{ usedFallback: boolean } | null>
}

export interface SlashCommandEvent {
  text?: string
  raw?: unknown
  user: {
    userId?: string
    fullName?: string
    userName?: string
  }
  channel: {
    post: (message: string | MockCardElement) => Promise<void>
    postEphemeral?: (
      user: string | { userId?: string },
      message: string | MockCardElement,
      options: { fallbackToDM: boolean }
    ) => Promise<{ usedFallback: boolean } | null>
  }
}
