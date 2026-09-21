export const ensureUniqueMessageIds = <T extends { id: string }>(
  messages: T[],
  generateId: () => string
): T[] => {
  const seen = new Set<string>()
  return messages.map(message => {
    if (message.id && !seen.has(message.id)) {
      seen.add(message.id)
      return message
    }

    let id = generateId()
    while (!id || seen.has(id)) {
      id = generateId()
    }
    seen.add(id)
    return { ...message, id }
  })
}
