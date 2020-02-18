export const insertCodeMetaData = props => {
  if (props._code && props._code.length > 0) {
    props._codeMeta = codeMetaData(props._code)
  }

  if (!props._children || props._children.length === 0) return

  for (let child of props._children) {
    insertCodeMetaData(child)
  }
}

const codeMetaData = code => {
  return {
    dependsOnStore: RegExp(/(store.)/g).test(code),
  }
}
