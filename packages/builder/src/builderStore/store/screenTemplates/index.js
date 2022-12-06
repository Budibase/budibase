import rowListScreen from "./rowListScreen"
import createFromScratchScreen from "./createFromScratchScreen"

const allTemplates = tables => [...rowListScreen(tables)]

// Allows us to apply common behaviour to all create() functions
const createTemplateOverride = (frontendState, template) => () => {
  const screen = template.create()
  screen.name = screen.props._id
  screen.routing.route = screen.routing.route.toLowerCase()
  screen.template = template.id
  return screen
}

export default (frontendState, tables) => {
  const enrichTemplate = template => ({
    ...template,
    create: createTemplateOverride(frontendState, template),
  })

  const fromScratch = enrichTemplate(createFromScratchScreen)
  const tableTemplates = allTemplates(tables).map(enrichTemplate)
  return [
    fromScratch,
    ...tableTemplates.sort((templateA, templateB) => {
      return templateA.name > templateB.name ? 1 : -1
    }),
  ]
}
