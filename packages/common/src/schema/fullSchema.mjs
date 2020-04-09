export const fullSchema = (models, views) => {
  const findModel = idOrName =>
    models.find(
      m => m.id === idOrName || m.name.toLowerCase() === idOrName.toLowerCase()
    )

  const findView = idOrName =>
    views.find(
      m => m.id === idOrName || m.name.toLowerCase() === idOrName.toLowerCase()
    )

  const findField = (modelIdOrName, fieldName) => {
    const model = models.find(
      m =>
        m.id === modelIdOrName ||
        m.name.toLowerCase() === modelIdOrName.toLowerCase()
    )
    return model.fields.find(
      f => f.name.toLowerCase() === fieldName.toLowerCase()
    )
  }

  const viewsForModel = modelId => views.filter(v => v.modelId === modelId)

  return {
    models,
    views,
    findModel,
    findField,
    findView,
    viewsForModel,
  }
}
