const ncp = require("ncp").ncp

ncp("./dist", "../server/builder", function(err) {
  if (err) {
    return console.error(err)
  }
  console.log("Copied dist folder to ../server/builder")
})
