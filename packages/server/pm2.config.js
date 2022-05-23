module.exports = {
  apps: [
    {
      script: "dist/index.js",
      instances: "4",
      exec_mode: "cluster",
    },
  ],
}
