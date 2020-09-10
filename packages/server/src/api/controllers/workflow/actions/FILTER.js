module.exports = async function filter({ args }) {
  const { field, condition, value } = args
  switch (condition) {
    case "equals":
      if (field !== value) return
      break
    default:
      return
  }
}
