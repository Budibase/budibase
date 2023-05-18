import { createWebsocket } from "@budibase/frontend-core"
import { userStore } from "builderStore"

export const createBuilderWebsocket = () => {
  const socket = createWebsocket("/socket/builder")

  socket.on("connect", () => {
    socket.emit("get-users", null, response => {
      userStore.actions.init(response.users)
    })
  })

  socket.on("user-update", userStore.actions.updateUser)
  socket.on("user-disconnect", userStore.actions.removeUser)
  socket.on("connect_error", err => {
    console.log("Failed to connect to builder websocket:", err.message)
  })

  return {
    ...socket,
    disconnect: () => {
      socket?.disconnect()
      userStore.actions.reset()
    },
  }
}
