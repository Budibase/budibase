import mocks from "./mocks"
import { generator } from "@budibase/backend-core/tests"
import TestConfiguration from "./TestConfiguration"
import structures from "./structures"
import API from "./api"
import { v4 as uuid } from "uuid"

const pkg = {
  structures,
  generator,
  uuid,
  TENANT_1: structures.TENANT_1,
  mocks,
  TestConfiguration,
  API,
}

export = pkg
