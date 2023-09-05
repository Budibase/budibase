let subscribers = []

export const onPreviewEvent = cb => {
  subscribers.push(cb)

  return () => {
    subscribers = subscribers.filter(callback => callback !== cb)
  }
}

export const emitPreviewEvent = event => {
  subscribers.forEach(cb => cb(event))
}
