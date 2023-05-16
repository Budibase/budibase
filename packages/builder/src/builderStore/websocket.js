import { createWebsocket } from "@budibase/frontend-core"
import { store } from "builderStore"

export const createBuilderWebsocket = () => {
  const socket = createWebsocket("/socket/builder")

  socket.on("connect", () => {
    socket.emit("get-users", null, response => {
      console.log("conntected!", response.users)
      store.update(state => ({
        ...state,
        users: response.users,
      }))
    })
  })

  socket.on("user-update", user => {})

  socket.on("user-disconnect", user => {})

  socket.on("connect_error", err => {
    console.log("Failed to connect to builder websocket:", err.message)
  })

  return socket
}
