

module.exports = dependenciesEnv => {
  return {
    devEnv: {
      image: "budibase/dependencies",
      tag: "latest",
      ports: [6379, 5984, 9000],
      env: dependenciesEnv,
      wait: {
        type: "text",
        text: "Test environment started...",
      },
    }
  }
}
