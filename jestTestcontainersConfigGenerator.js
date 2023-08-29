module.exports = () => {
  return {
    dockerCompose: {
      composeFilePath: "../../hosting",
      composeFile: "docker-compose.test.yaml",
      startupTimeout: 10000,
    },
  }
}
