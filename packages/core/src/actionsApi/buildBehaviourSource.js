import { has } from "lodash"
import { ConflictError } from "../common/errors"

export const createBehaviourSources = () => {
  const sources = {}
  const register = (name, funcsObj) => {
    if (has(sources, name)) {
      throw new ConflictError(`Source '${name}' already exists`)
    }

    sources[name] = funcsObj
  }
  sources.register = register
  return sources
}
