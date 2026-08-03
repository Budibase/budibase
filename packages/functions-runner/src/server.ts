import http from "node:http"

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

export const createServer = () =>
  http.createServer((request, response) => {
    if (request.method === "GET" && request.url === "/health") {
      sendJSON(response, 200, {
        healthy: true,
      })
      return
    }

    sendJSON(response, 404, { error: "Not found" })
  })
