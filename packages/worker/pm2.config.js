module.exports = {
  apps: [
    {
      script: "./dist/index.cjs",
      instances: "max",
      exec_mode: "cluster",
    },
  ],
}
