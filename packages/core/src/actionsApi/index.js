import { executeAction } from "./execute"

export const getActionsApi = app => ({
  execute: executeAction(app),
})

export default getActionsApi
