module.exports = {
  apps: [
    {
      script: "./dist/index.js",
      // "max" counts the host's CPUs, not the container's cgroup CPU limit. On a
      // 24 core host that forked 24 instances plus their worker farms - 79
      // processes and 19GB of RSS - which is instant death under a pod limit.
      instances: process.env.CLUSTER_INSTANCES || "max",
      exec_mode: "cluster",
    },
  ],
}
