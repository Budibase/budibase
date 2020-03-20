import { setCleanupFunc } from "../transactions/setCleanupFunc"

export const cloneApp = (app, mergeWith) => {
  const newApp = { ...app }
  Object.assign(newApp, mergeWith)
  setCleanupFunc(newApp)
  return newApp
}