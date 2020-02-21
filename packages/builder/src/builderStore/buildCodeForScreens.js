const buildCodeForSingleScreen = screen => {
  let code = ""
  const walkProps = props => {
    if (props._code && props._code.trim().length > 0) {
      code += buildComponentCode(props)
    }

    if (!props._children) return

    for (let child of props._children) {
      walkProps(child)
    }
  }

  walkProps(screen.props)

  return code
}

export const buildCodeForScreens = screens => {
  let allfunctions = ""
  for (let screen of screens) {
    allfunctions += buildCodeForSingleScreen(screen)
  }

  return `return ({ ${allfunctions} });`
}

const buildComponentCode = componentProps =>
  `"${componentProps._id}" : (render, context, state, routeParams) => {
${componentProps._code}
},
`
