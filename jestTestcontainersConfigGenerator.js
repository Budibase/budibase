module.exports = () => {
  return {
    couchdb: {
      image: "budibase/couchdb",
      ports: [5984],
      env: {
        COUCHDB_PASSWORD: "budibase",
        COUCHDB_USER: "budibase",
      },
      wait: {
        type: "ports",
        timeout: 20000,
      }
    }
  }
}
