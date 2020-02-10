export const createCoreApp = (backendDefinition, user) => {
  const app = {
    datastore: null,
    crypto: null,
    publish: () => {},
    hierarchy: backendDefinition.hierarchy,
    actions: backendDefinition.actions,
    user,
  }

  return app
}
