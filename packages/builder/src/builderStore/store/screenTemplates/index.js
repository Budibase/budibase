import newRowScreen from "./newRowScreen"
import rowDetailScreen from "./rowDetailScreen"
import rowListScreen from "./rowListScreen"
import emptyNewRowScreen from "./emptyNewRowScreen"
import createFromScratchScreen from "./createFromScratchScreen"
import emptyRowDetailScreen from "./emptyRowDetailScreen"
import { generateNewIdsForComponent } from "../../storeUtils"
import { uuid } from "builderStore/uuid"

const allTemplates = tables => [
  createFromScratchScreen,
  ...newRowScreen(tables),
  ...rowDetailScreen(tables),
  ...rowListScreen(tables),
  emptyNewRowScreen,
  emptyRowDetailScreen,
]

// allows us to apply common behaviour to all create() functions
const createTemplateOverride = (frontendState, create) => () => {
  const screen = create()
  for (let component of screen.props._children) {
    generateNewIdsForComponent(component, frontendState, false)
  }
  screen.props._id = uuid()
  screen.name = screen.props._id
  screen.route = screen.route.toLowerCase()
  return screen
}

export default (frontendState, tables) =>
  allTemplates(tables).map(template => ({
    ...template,
    create: createTemplateOverride(frontendState, template.create),
  }))
