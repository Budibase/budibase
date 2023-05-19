module.exports = {
  apps: [
    {
      script: "./index.cjs",
      instances: "max",
      exec_mode: "cluster",
    },
  ],
}
