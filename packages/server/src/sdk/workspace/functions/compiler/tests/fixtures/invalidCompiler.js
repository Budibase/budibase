process.on("message", () => {
  process.send({
    diagnostics: [{ code: "TS2322", message: "Invalid", line: "1" }],
  })
})
