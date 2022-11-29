import env from "./environment"

export function pinoSettings() {
  return {
    prettyPrint: {
      levelFirst: true,
    },
    level: env.LOG_LEVEL || "error",
    autoLogging: {
      ignore: (req: { url: string }) => req.url.includes("/health"),
    },
  }
}
