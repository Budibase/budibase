exports.makePartial = obj => {
  const newObj = {}
  for (let key of Object.keys(obj)) {
    if (typeof obj[key] === "object") {
      newObj[key] = exports.makePartial(obj[key])
    } else {
      newObj[key] = obj[key]
    }
  }
  return expect.objectContaining(newObj)
}
