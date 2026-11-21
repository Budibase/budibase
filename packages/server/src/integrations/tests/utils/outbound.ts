import net from "net"

export const BLOCKED = "Host is blocked or could not be resolved safely."

export interface Listener {
  port: number
  connections: () => number
  close: () => Promise<void>
}

export async function listen(
  server: net.Server,
  host: string
): Promise<{ port: number; close: () => Promise<void> }> {
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject)
    server.listen(0, host, () => {
      server.off("error", reject)
      resolve()
    })
  })
  return {
    port: (server.address() as net.AddressInfo).port,
    close: () => new Promise(resolve => server.close(() => resolve())),
  }
}

// Stands in for an internal service: it counts connections and drops them. It
// listens on ::1, which the redirect tests add to the blacklist.
export async function startInternalListener(): Promise<Listener> {
  let connections = 0
  const server = net.createServer(socket => {
    connections++
    socket.destroy()
  })
  const { port, close } = await listen(server, "::1")
  return { port, connections: () => connections, close }
}
