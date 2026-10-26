import net from "net"
import type { Socket } from "net"
import { ImapFlow } from "imapflow"
import { fetchMessages } from "../../email/utils/fetchMessages"
import { toOutputFields } from "../../email/utils/toOutputFields"

interface MockImapOptions {
  empty?: boolean
  date?: string
  rejectFetch?: boolean
  vanished?: boolean
}

const startImapServer = async ({
  empty = false,
  date = "Mon, 01 Jan 2024 00:00:00 +0000",
  rejectFetch = false,
  vanished = false,
}: MockImapOptions = {}) => {
  const sockets = new Set<Socket>()
  const server = net.createServer(socket => {
    sockets.add(socket)
    socket.on("close", () => sockets.delete(socket))
    socket.write("* OK IMAP server ready\r\n")

    let buffer = ""
    let authTag: string | undefined
    let authMethod: string | undefined
    socket.on("data", chunk => {
      buffer += chunk.toString("utf8")

      let lineBreak = buffer.indexOf("\r\n")
      while (lineBreak !== -1) {
        const line = buffer.slice(0, lineBreak)
        buffer = buffer.slice(lineBreak + 2)
        const [tag, command, ...args] = line.split(" ")

        if (authTag) {
          const credentials = Buffer.from(line, "base64").toString("utf8")
          const expected =
            authMethod === "PLAIN"
              ? "\u0000user@example.com\u0000password"
              : "user=user@example.com\u0001auth=Bearer access-token\u0001\u0001"
          const status = credentials === expected ? "OK" : "NO"
          socket.write(`${authTag} ${status} AUTHENTICATE completed\r\n`)
          authTag = undefined
        } else if (command === "CAPABILITY") {
          socket.write(
            `* CAPABILITY IMAP4rev1 AUTH=PLAIN AUTH=XOAUTH2\r\n${tag} OK CAPABILITY completed\r\n`
          )
        } else if (command === "AUTHENTICATE") {
          authTag = tag
          authMethod = args[0]
          socket.write("+ \r\n")
        } else if (command === "LIST") {
          socket.write(`* LIST () "/" ""\r\n${tag} OK LIST completed\r\n`)
        } else if (command === "SELECT") {
          socket.write(
            `* FLAGS (\\Seen)\r\n* ${empty ? 0 : 2} EXISTS\r\n* OK [UIDVALIDITY 1]\r\n* OK [UIDNEXT ${empty ? 1 : 9}]\r\n${tag} OK [READ-WRITE] SELECT completed\r\n`
          )
        } else if (command === "FETCH" || command === "UID") {
          if (rejectFetch) {
            socket.write(`${tag} NO FETCH failed\r\n`)
          } else {
            const uidFetch = command === "UID"
            const range = args[uidFetch ? 1 : 0]
            const first = Number(range.split(":")[0])
            for (const [index, uid] of [5, 8].entries()) {
              const seq = index + 1
              const matches = uidFetch ? uid >= first : seq === first
              if (!empty && !vanished && matches) {
                const source = [
                  "From: sender@example.com",
                  "To: recipient@example.com",
                  `Subject: Message ${uid}`,
                  `Date: ${date}`,
                  "Content-Type: text/plain; charset=utf-8",
                  "",
                  `Body ${uid}`,
                ].join("\r\n")
                const envelope = `("${date}" "Message ${uid}" ((NIL NIL "sender" "example.com")) NIL NIL ((NIL NIL "recipient" "example.com")) NIL NIL NIL "<${uid}@example.com>")`
                socket.write(
                  `* ${seq} FETCH (UID ${uid} FLAGS () ENVELOPE ${envelope} BODYSTRUCTURE ("TEXT" "PLAIN" ("CHARSET" "UTF-8") NIL NIL "7BIT" 6 1) INTERNALDATE "01-Jan-2024 00:00:00 +0000" RFC822.SIZE ${Buffer.byteLength(source)} BODY[] {${Buffer.byteLength(source)}}\r\n${source})\r\n`
                )
              }
            }
            socket.write(`${tag} OK FETCH completed\r\n`)
          }
        } else if (command === "LOGOUT") {
          socket.end(`* BYE Logging out\r\n${tag} OK LOGOUT completed\r\n`)
        } else {
          socket.write(`${tag} BAD Unsupported command\r\n`)
        }

        lineBreak = buffer.indexOf("\r\n")
      }
    })
  })

  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve))
  const address = server.address()
  if (!address || typeof address === "string") {
    throw new Error("Unable to start IMAP server")
  }

  return {
    port: address.port,
    close: async () => {
      for (const socket of sockets) {
        socket.destroy()
      }
      await new Promise<void>((resolve, reject) =>
        server.close(err => (err ? reject(err) : resolve()))
      )
    },
  }
}

describe("email fetching with ImapFlow", () => {
  let server: Awaited<ReturnType<typeof startImapServer>>
  let client: ImapFlow

  const setup = async ({
    oauth = false,
    ...serverOptions
  }: MockImapOptions & { oauth?: boolean } = {}) => {
    server = await startImapServer(serverOptions)
    client = new ImapFlow({
      host: "127.0.0.1",
      port: server.port,
      secure: false,
      auth: {
        user: "user@example.com",
        ...(oauth ? { accessToken: "access-token" } : { pass: "password" }),
      },
      logger: false,
    })
  }

  afterEach(async () => {
    client.close()
    await server.close()
  })

  it.each([
    { name: "password", oauth: false },
    { name: "OAuth2", oauth: true },
  ])(
    "fetches and parses the newest email using $name authentication",
    async ({ oauth }) => {
      await setup({ oauth })

      const messages = await fetchMessages(client, "INBOX")
      const output = await Promise.all(messages.map(toOutputFields))

      expect(messages.map(message => message.uid)).toEqual([8])
      expect(output).toEqual([
        {
          from: "sender@example.com",
          to: "recipient@example.com",
          cc: [],
          subject: "Message 8",
          sentAt: "2024-01-01T00:00:00.000Z",
          bodyText: "Body 8",
          bodyTextTruncated: false,
        },
      ])
    }
  )

  it("fetches all unseen UIDs when UIDs differ from sequence numbers", async () => {
    await setup()

    const messages = await fetchMessages(client, "INBOX", 4)

    expect(messages.map(message => message.uid)).toEqual([5, 8])
  })

  it("excludes previously seen UIDs", async () => {
    await setup()

    const messages = await fetchMessages(client, "INBOX", 5)

    expect(messages.map(message => message.uid)).toEqual([8])
  })

  it("returns no messages from an empty mailbox", async () => {
    await setup({ empty: true })

    expect(await fetchMessages(client, "INBOX")).toEqual([])
  })

  it("returns no messages when no new UID has arrived", async () => {
    await setup()

    expect(await fetchMessages(client, "INBOX", 8)).toEqual([])
  })

  it("returns no messages when the newest message vanishes before FETCH", async () => {
    await setup({ vanished: true })

    expect(await fetchMessages(client, "INBOX")).toEqual([])
  })

  it("preserves an email with a malformed date header", async () => {
    await setup({ date: "invalid date" })

    const messages = await fetchMessages(client, "INBOX")
    const output = await Promise.all(messages.map(toOutputFields))

    expect(output).toEqual([
      {
        from: "sender@example.com",
        to: "recipient@example.com",
        cc: [],
        subject: "Message 8",
        sentAt: undefined,
        bodyText: "Body 8",
        bodyTextTruncated: false,
      },
    ])
  })

  it.each([
    { name: "the newest message", lastSeenUid: undefined },
    { name: "unseen messages", lastSeenUid: 4 },
  ])("rejects a failed FETCH of $name", async ({ lastSeenUid }) => {
    await setup({ rejectFetch: true })

    await expect(fetchMessages(client, "INBOX", lastSeenUid)).rejects.toThrow()
  })
})
