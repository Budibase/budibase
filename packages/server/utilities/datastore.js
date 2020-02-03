module.exports = config =>
  require(`../../datastores/datastores/${config.datastore}`)
