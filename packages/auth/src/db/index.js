let Pouch

module.exports.setDB = pouch => {
  Pouch = pouch
}

module.exports.getDB = dbName => {
  return new Pouch(dbName)
}
