const fs = require("fs")

module.exports = () => ({
  main: {
    outputToFile: async ({ filename, content }) => {
      await new Promise((resolve, reject) => {
        fs.writeFile(
          `./tests/.data/${filename}`,
          content,
          { encoding: "utf8" },
          err => {
            if (err) reject()
            else resolve(err)
          }
        )
      })
    },
  },
})
