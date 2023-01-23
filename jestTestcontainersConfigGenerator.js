module.exports = env => ({
  devEnv: {
    image: "budibase/dependencies",
    tag: "latest",
    ports: [6379, 5984, 9000],
    env,
    wait: {
      type: "text",
      text: "Test environment started...",
    },
  },
})
