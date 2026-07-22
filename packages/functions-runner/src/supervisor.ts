import http from "http"
import { loadConfig, RunnerConfig } from "./config"
import { execute } from "./executor"
import type { ExecuteRequest, HealthResponse } from "./protocol"

const startedAt = Date.now()

const isolatedVmAvailable = (): boolean => {
  try {
    require.resolve("isolated-vm")
    return true
  } catch {
    return false
  }
}

const send = (res: http.ServerResponse, status: number, body: unknown) => {
  const payload = JSON.stringify(body)
  res.writeHead(status, {
    "content-type": "application/json",
    "content-length": Buffer.byteLength(payload),
  })
  res.end(payload)
}

const readBody = (
  req: http.IncomingMessage,
  maxBytes: number
): Promise<string> =>
  new Promise((resolve, reject) => {
    let size = 0
    const chunks: Buffer[] = []
    req.on("data", (chunk: Buffer) => {
      size += chunk.length
      if (size > maxBytes) {
        reject(new Error("Request body too large"))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
    req.on("error", reject)
  })

const handleExecute = async (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  config: RunnerConfig
) => {
  let request: ExecuteRequest
  try {
    const raw = await readBody(req, config.maxBodyBytes)
    request = JSON.parse(raw)
  } catch (err) {
    return send(res, 400, {
      error: { name: "BadRequest", message: (err as Error).message },
    })
  }

  if (!request || typeof request.code !== "string" || !request.id) {
    return send(res, 400, {
      error: {
        name: "BadRequest",
        message: "`id` and `code` are required fields",
      },
    })
  }

  const response = await execute(request, config)
  return send(res, 200, response)
}

export const createServer = (
  config: RunnerConfig = loadConfig()
): http.Server => {
  const server = http.createServer((req, res) => {
    const url = req.url || "/"

    if (req.method === "GET" && (url === "/health" || url === "/")) {
      const body: HealthResponse = {
        status: "ok",
        service: "functions-runner",
        uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
        isolatedVm: isolatedVmAvailable(),
      }
      return send(res, 200, body)
    }

    if (req.method === "POST" && url === "/execute") {
      handleExecute(req, res, config).catch(err => {
        send(res, 500, {
          error: { name: "InternalError", message: (err as Error).message },
        })
      })
      return
    }

    return send(res, 404, {
      error: { name: "NotFound", message: `No route for ${req.method} ${url}` },
    })
  })

  return server
}
