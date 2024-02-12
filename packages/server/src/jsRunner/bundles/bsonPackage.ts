import { EJSON } from "bson"

export { deserialize } from "bson"
export const toJson = EJSON.deserialize
