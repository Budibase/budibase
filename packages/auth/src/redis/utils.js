const SEPARATOR = "-"

exports.Databases = {
  PW_RESETS: "pwReset",
}

exports.addDbPrefix = (db, key) => {
  return `${db}${SEPARATOR}${key}`
}

exports.removeDbPrefix = key => {
  let parts = key.split(SEPARATOR)
  if (parts.length >= 2) {
    parts.shift()
    return parts.join(SEPARATOR)
  } else {
    // return the only part
    return parts[0]
  }
}
