import newRecordScreen from "./newRecordScreen"
import recordDetailScreen from "./recordDetailScreen"
import recordListScreen from "./recordListScreen"
import emptyNewRecordScreen from "./emptyNewRecordScreen"
import emptyContainerScreen from "./emptyContainerScreen"
import emptyRecordDetailScreen from "./emptyRecordDetailScreen"
import { generateNewIdsForComponent } from "../../storeUtils"
import { uuid } from "builderStore/uuid"

const allTemplates = models => [
  emptyContainerScreen,
  ...newRecordScreen(models),
  emptyNewRecordScreen,
  ...recordDetailScreen(models),
  emptyRecordDetailScreen,
  ...recordListScreen(models),
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
