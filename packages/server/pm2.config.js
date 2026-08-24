module.exports = {
  apps: [
    {
      script: "./dist/index.js",
      instances: process.env.CLUSTER_INSTANCES || "max",
      exec_mode: "cluster",
    },
  ],
}
