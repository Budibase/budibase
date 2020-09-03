export function uuid() {
  // always want to make this start with a letter, as this makes it
  // easier to use with mustache bindings in the client
  return "cxxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
