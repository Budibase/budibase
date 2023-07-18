import TestConfiguration from "../TestConfiguration"
import { ViewV2API } from "./viewV2"

export default class API {
  viewV2: ViewV2API

  constructor(config: TestConfiguration) {
    this.viewV2 = new ViewV2API(config)
  }
}
