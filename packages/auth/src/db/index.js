let Pouch

module.exports.getDB = () => {
  return Pouch
}

module.exports.setDB = pouch => {
  Pouch = pouch
}
