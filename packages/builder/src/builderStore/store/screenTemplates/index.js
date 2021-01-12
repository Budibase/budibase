import newRowScreen from "./newRowScreen"
import rowDetailScreen from "./rowDetailScreen"
import rowListScreen from "./rowListScreen"
import emptyNewRowScreen from "./emptyNewRowScreen"
import createFromScratchScreen from "./createFromScratchScreen"
import emptyRowDetailScreen from "./emptyRowDetailScreen"
import { uuid } from "builderStore/uuid"

const allTemplates = tables => [
  createFromScratchScreen,
  ...newRowScreen(tables),
  ...rowDetailScreen(tables),
  ...rowListScreen(tables),
  emptyNewRowScreen,
  emptyRowDetailScreen,
]

// Recurses through a component tree and generates new unique ID's
const makeUniqueIds = component => {
  if (!component) {
    return
  }
  component._id = uuid()
  if (component._children) {
    component._children.forEach(makeUniqueIds)
  }
}

// Allows us to apply common behaviour to all create() functions
const createTemplateOverride = (frontendState, create) => () => {
  const screen = create()
  makeUniqueIds(screen.props)
  screen.name = screen.props._id
  screen.routing.route = screen.routing.route.toLowerCase()
  return screen
}

export default (frontendState, tables) =>
  allTemplates(tables).map(template => ({
    ...template,
    create: createTemplateOverride(frontendState, template.create),
  }))
