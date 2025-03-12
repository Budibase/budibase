import { BudiStore } from "@/stores/BudiStore"

interface Config {
  name: string
}

export class OAuth2Store extends BudiStore<Config[]> {
  constructor() {
    super([])
  }
}

const store = new OAuth2Store()

export const oauth2 = {
  ...store,
}
