import editRecordScreen from "./editRecordScreen"
import { generateNewIdsForComponent } from "../../storeUtils"

const allTemplates = models => [...editRecordScreen(models)]

// allows us to apply common behaviour to all create() functions
const createTemplateOverride = (frontendState, create) => () => {
  const screen = create()
  generateNewIdsForComponent(screen.props, frontendState)
  return screen
}

export default (frontendState, models) =>
  allTemplates(models).map(template => ({
    ...template,
    create: createTemplateOverride(frontendState, template.create),
  }))
