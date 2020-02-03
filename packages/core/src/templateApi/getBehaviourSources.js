export const getBehaviourSources = async datastore => {
  await datastore.loadFile("/.config/behaviourSources.js")
}
