export const handleError = err => {
  let update = { ...err }
  return Object.keys(update).reduce((acc, key) => {
    if (update[key]) {
      acc[key] = update[key]
    }
    return acc
  }, {})
}

export const passwordsMatch = (password, confirmation) => {
  let confirm = confirmation?.trim()
  let pwd = password?.trim()
  return (
    typeof confirm === "string" && typeof pwd === "string" && confirm == pwd
  )
}
