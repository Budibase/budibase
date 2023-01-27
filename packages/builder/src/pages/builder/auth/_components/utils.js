exports.handleError = (validate, errors) => {
  const err = validate()
  let update = { ...errors, ...err }
  errors = Object.keys(update).reduce((acc, key) => {
    if (update[key]) {
      acc[key] = update[key]
    }
    return acc
  }, {})
}

exports.passwordsMatch = (password, confirmation) => {
  let confirm = confirmation?.trim()
  let pwd = password?.trim()
  return (
    typeof confirm === "string" && typeof pwd === "string" && confirm == pwd
  )
}
