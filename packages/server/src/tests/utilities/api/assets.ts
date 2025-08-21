import { TestAPI } from "./base"

export class AssetsAPI extends TestAPI {
  get = async (path: string) => {
    // has to be raw, body isn't JSON
    return await this._requestRaw("get", `/builder/${path}`)
  }
}
