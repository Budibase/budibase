import * as context from "../context"
import * as tenancy from "./tenancy"

const pkg = {
  ...context,
  ...tenancy,
}

export = pkg
