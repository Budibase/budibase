let Pouch

module.exports.setDB = pouch => {
  Pouch = pouch
}

module.exports.getDB = (dbName, opts = {}) => {
  return new Pouch(dbName, opts)
}

module.exports.getCouch = () => {
  return Pouch
}
