const { Server } = require("socket.io")

const io = new Server(4000)

io.on("connection", socket => {
  socket.on("foo", arg => {
    console.log(arg)
  })
})
