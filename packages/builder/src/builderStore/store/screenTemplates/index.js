import newRowScreen from "./newRowScreen"
import rowDetailScreen from "./rowDetailScreen"
import rowListScreen from "./rowListScreen"
import createFromScratchScreen from "./createFromScratchScreen"

const allTemplates = tables => [
  ...newRowScreen(tables),
  ...rowDetailScreen(tables),
  ...rowListScreen(tables),
]

// Allows us to apply common behaviour to all create() functions
const createTemplateOverride = (frontendState, create) => () => {
  const screen = create()
  screen.name = screen.props._id
  screen.routing.route = screen.routing.route.toLowerCase()
  return screen
}

export default (frontendState, tables) => {
  const enrichTemplate = template => ({
    ...template,
    create: createTemplateOverride(frontendState, template.create),
  })

  const fromScratch = enrichTemplate(createFromScratchScreen)
  const tableTemplates = allTemplates(tables.list).map(enrichTemplate)
  return [
    fromScratch,
    ...tableTemplates.sort((templateA, templateB) => {
      return templateA.name > templateB.name ? 1 : -1
    }),
  ]
}
