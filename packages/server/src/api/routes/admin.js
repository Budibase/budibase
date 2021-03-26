const app = require("express")()
const { router } = require("bull-board")

app.use("/admin/queues", router)
