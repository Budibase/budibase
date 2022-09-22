module.exports = {
  apps: [
    {
      script: "./dist/index.ts",
      instances: "max",
      exec_mode: "cluster",
    },
  ],
}
