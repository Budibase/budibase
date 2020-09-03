import mustache from "mustache"

// this is a much more liberal version of mustache's escape function
// ...just ignoring < and > to prevent tags from user input
// original version here https://github.com/janl/mustache.js/blob/4b7908f5c9fec469a11cfaed2f2bed23c84e1c5c/mustache.js#L78

const entityMap = {
  "<": "&lt;",
  ">": "&gt;",
}

mustache.escape = text =>
  String(text).replace(/[&<>"'`=/]/g, function fromEntityMap(s) {
    return entityMap[s]
  })

export default mustache.render
