import { FunctionErrorCode } from "@budibase/types"
import http from "node:http"
import { FunctionProtocolError, parseFunctionRunRequest } from "./protocol"
import { FunctionSupervisor } from "./supervisor"

const MAX_REQUEST_BYTES = 2 * 1024 * 1024

const sendJSON = (
  response: http.ServerResponse,
  statusCode: number,
  body: object
) => {
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
  })
  response.end(JSON.stringify(body))
}

const readBody = (request: http.IncomingMessage) =>
  new Promise<string>((resolve, reject) => {
    const chunks: ArrayLike<number>[] = []
    let bytes = 0
    let failed = false

    request.on("data", (chunk: Buffer) => {
      if (failed) {
        return
      }
      bytes += chunk.length
      if (bytes > MAX_REQUEST_BYTES) {
        failed = true
        reject(new FunctionProtocolError("Function run request is too large"))
        return
      }
      chunks.push(chunk)
    })
    request.on("end", () => {
      if (!failed) {
        const body = new Uint8Array(bytes)
        let offset = 0
        for (const chunk of chunks) {
          body.set(chunk, offset)
          offset += chunk.length
        }
        resolve(new TextDecoder().decode(body))
      }
    })
    request.on("error", () => {
      if (!failed) {
        failed = true
        reject(new FunctionProtocolError("Malformed Function run request"))
      }
    })
    request.on("aborted", () => {
      if (!failed) {
        failed = true
        reject(new FunctionProtocolError("Malformed Function run request"))
      }
    })
  })

const handleRequest = async (
  request: http.IncomingMessage,
  response: http.ServerResponse,
  supervisor: FunctionSupervisor
) => {
  if (request.method === "GET" && request.url === "/health") {
    const healthy = supervisor.isHealthy()
    sendJSON(response, healthy ? 200 : 503, { healthy })
    return
  }

  if (request.method === "POST" && request.url === "/runs") {
    try {
      const runRequest = parseFunctionRunRequest(await readBody(request))
      sendJSON(response, 200, await supervisor.execute(runRequest))
    } catch (error) {
      if (error instanceof FunctionProtocolError) {
        sendJSON(response, 400, {
          error: { code: error.code, message: error.message },
        })
        return
      }
      sendJSON(response, 500, {
        error: {
          code: FunctionErrorCode.FUNCTION_RUNNER_UNAVAILABLE,
          message: "Functions runner is unavailable",
        },
      })
    }
    return
  }

  if (request.method === "DELETE" && request.url?.startsWith("/runs/")) {
    const runId = request.url.slice("/runs/".length)
    if (runId) {
      try {
        supervisor.terminate(decodeURIComponent(runId))
        sendJSON(response, 202, { terminated: true })
      } catch {
        sendJSON(response, 400, {
          error: {
            code: FunctionErrorCode.FUNCTION_PROTOCOL_ERROR,
            message: "Malformed Function run ID",
          },
        })
      }
      return
    }
  }

  sendJSON(response, 404, { error: "Not found" })
}

export const createServer = (supervisor = new FunctionSupervisor()) =>
  http.createServer((request, response) => {
    handleRequest(request, response, supervisor).catch(() => {
      if (!response.headersSent) {
        sendJSON(response, 500, {
          error: {
            code: FunctionErrorCode.FUNCTION_RUNNER_UNAVAILABLE,
            message: "Functions runner is unavailable",
          },
        })
      }
    })
  })
