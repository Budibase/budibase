module.exports = {
  apps: [
    {
      script: "index.js",
      instances: "max",
      exec_mode: "cluster",
    },
  ],
}
