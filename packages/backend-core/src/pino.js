const env = require("./environment")

exports.pinoSettings = () => ({
  prettyPrint: {
    levelFirst: true,
  },
  level: env.LOG_LEVEL || "error",
  autoLogging: {
    ignore: req => req.url.includes("/health"),
  },
})
