module.exports = dependenciesEnv => {
  return {
    dockerCompose: {
      composeFilePath: "../../hosting",
      composeFile: "docker-compose.test.yaml",
      startupTimeout: 10000,
    },
  }
}
