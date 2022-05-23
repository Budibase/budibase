module.exports = {
  apps: [
    {
      script: "./dist/index.js",
      instances: "max",
      exec_mode: "cluster",
    },
  ],
}
