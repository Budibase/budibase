import * as utils from "./utilities"
export * from "./utilities"

export const init = (corePkg: any) => {
  utils.mocks.events.init(corePkg)
}
