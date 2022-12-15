module.exports = {
  devEnv: {
    image: "budibase/tests",
    tag: "latest",
    ports: [6379, 5984, 9000],
    env: {},
    wait: {
      type: "text",
      text: "Test environment started...",
    },
  },
}
