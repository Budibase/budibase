import newRecordScreen from "./newRecordScreen"
import recordDetailScreen from "./recordDetailScreen"
import { generateNewIdsForComponent } from "../../storeUtils"
import { uuid } from "builderStore/uuid"

const allTemplates = models => [
  ...newRecordScreen(models),
  ...recordDetailScreen(models),
]

// allows us to apply common behaviour to all create() functions
const createTemplateOverride = (frontendState, create) => () => {
  const screen = create()
  for (let component in screen.props.children) {
    generateNewIdsForComponent(component, frontendState)
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
