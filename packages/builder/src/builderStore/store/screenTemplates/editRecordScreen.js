export default function(models) {
  return models.map(model => ({
    name: `Edit ${model.name}`,
    create: () => createScreen(model),
  }))
}

const createScreen = model => ({})
