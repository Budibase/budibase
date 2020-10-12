import newRecordScreen from "./newRecordScreen"
import recordDetailScreen from "./recordDetailScreen"
import recordListScreen from "./recordListScreen"
import emptyNewRecordScreen from "./emptyNewRecordScreen"
import createFromScratchScreen from "./createFromScratchScreen"
import emptyRecordDetailScreen from "./emptyRecordDetailScreen"
import { generateNewIdsForComponent } from "../../storeUtils"
import { uuid } from "builderStore/uuid"

const allTemplates = models => [
  createFromScratchScreen,
  ...newRecordScreen(models),
  ...recordDetailScreen(models),
  ...recordListScreen(models),
  emptyNewRecordScreen,
  emptyRecordDetailScreen,
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

export default (frontendState, models) =>
  allTemplates(models).map(template => ({
    ...template,
    create: createTemplateOverride(frontendState, template.create),
  }))
