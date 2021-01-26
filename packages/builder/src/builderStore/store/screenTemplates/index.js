import newRowScreen from "./newRowScreen"
import rowDetailScreen from "./rowDetailScreen"
import rowListScreen from "./rowListScreen"
import emptyNewRowScreen from "./emptyNewRowScreen"
import createFromScratchScreen from "./createFromScratchScreen"
import emptyRowDetailScreen from "./emptyRowDetailScreen"

const allTemplates = tables => [
  createFromScratchScreen,
  ...newRowScreen(tables),
  ...rowDetailScreen(tables),
  ...rowListScreen(tables),
  emptyNewRowScreen,
  emptyRowDetailScreen,
]

// Allows us to apply common behaviour to all create() functions
const createTemplateOverride = (frontendState, create) => () => {
  const screen = create()
  screen.name = screen.props._id
  screen.routing.route = screen.routing.route.toLowerCase()
  return screen
}

export default (frontendState, tables) =>
  allTemplates(tables).map(template => ({
    ...template,
    create: createTemplateOverride(frontendState, template.create),
  }))
