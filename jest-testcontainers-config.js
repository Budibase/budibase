module.exports = {
  devEnv: {
    image: "budibase/dependencies",
    tag: "latest",
    ports: [6379, 5984, 9000],
    env: {
      COUCHDB_USER: "test_couchdb_user",
      COUCHDB_PASSWORD: "test_couchdb_password",
    },
    wait: {
      type: "text",
      text: "Test environment started...",
    },
  },
}
