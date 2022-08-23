import TestConfiguration from "./TestConfiguration"
import structures from "./structures"
import mocks from "./mocks"

const config = new TestConfiguration()
const request = config.getRequest()

const pkg =  {
  structures,
  mocks,
  config,
  request,
}

export = pkg
