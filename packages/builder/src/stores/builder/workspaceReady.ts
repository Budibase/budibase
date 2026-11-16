const listeners = new WeakMap<object, Set<() => void>>()

export const onWorkspaceReady = ({
  socket,
  callback,
}: {
  socket: object
  callback: () => void
}) => {
  const callbacks = listeners.get(socket) ?? new Set<() => void>()
  listeners.set(socket, callbacks)
  callbacks.add(callback)
  return () => callbacks.delete(callback)
}

export const notifyWorkspaceReady = (socket: object) => {
  listeners.get(socket)?.forEach(callback => callback())
}
