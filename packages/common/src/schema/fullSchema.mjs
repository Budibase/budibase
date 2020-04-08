export const fullSchema = (models, views) => {
  const findModel = idOrName =>
    models.find(m => m.id === idOrName || m.name === idOrName)

  const findView = idOrName =>
    views.find(m => m.id === idOrName || m.name === idOrName)

  const findField = (modelIdOrName, fieldName) => {
    const model = models.find(
      m => m.id === modelIdOrName || m.name === modelIdOrName
    )
    return model.fields.find(f => f.name === fieldName)
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
