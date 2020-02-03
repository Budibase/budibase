export const getRecordPath = () => {
  const parts = []

  const add = current => {
    parts.push(current.name)
    if (current.parent().type === "root") {
      return
    }

    add(current.parent())
  }

  return parts.reverse().join("/")
}
