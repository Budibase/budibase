module.exports = props => {
  if (props._codeMeta) {
    delete props._codeMeta
  }

  for (let child of props._children || []) {
    module.exports(child)
  }
}
