import crypto from "crypto"

type AnyFn = (...args: any[]) => any

interface ChatOptions {
  userName?: string
  adapters?: Record<string, unknown>
  state?: unknown
  logger?: string
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
      teams: async () => new Response("", { status: 200 }),
      slack: async () => new Response("", { status: 200 }),
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

  onSubscribedMessage(handler: AnyFn) {
    this.subscribedHandlers.push(handler)
  }

  onInstallationUpdate(action: string, handler: AnyFn) {
    this.installationHandlers.set(action, handler)
  }

  getAdapter(name: string) {
    return this.adapters[name]
  }
}

export interface Message {
  text?: string
  raw?: unknown
  author: {
    userId: string
    fullName?: string
  }
}

export interface Thread {
  post: (text: string) => Promise<void>
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
    post: (text: string) => Promise<void>
  }
}
