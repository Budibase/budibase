import { BudiStore } from "../BudiStore"

type GotoFuncType = (path: string) => void

interface NavigationState {
  initialisated: boolean
  goto: GotoFuncType
}

class NavigationStore extends BudiStore<NavigationState> {
  constructor() {
    super({
      initialisated: false,
      goto: undefined as any,
    })
  }

  init(gotoFunc: GotoFuncType) {
    if (typeof gotoFunc !== "function") {
      throw new Error(
        `gotoFunc must be a function, found a "${typeof gotoFunc}" instead`
      )
    }
    this.set({
      initialisated: true,
      goto: gotoFunc,
    })
  }
}

export const navigation = new NavigationStore()
