

module.exports = dependenciesEnv => {
  if (process.env.DEV_TOOLS) {
    return {
      dockerCompose: {
        composeFilePath: `${__dirname}/hosting`,
        composeFile: 'docker-compose.dev.yaml',
        startupTimeout: 10000,
      }
    }
  }

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
