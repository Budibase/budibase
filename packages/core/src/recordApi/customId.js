import { find, take, union } from "lodash/fp"
import { getFlattenedHierarchy } from "../templateApi/hierarchy"
import { $, splitKey, joinKey } from "../common"
import { NotFoundError } from "../common/errors"

export const customId = app => (nodeName, id) => {
  const node = $(app.hierarchy, [
    getFlattenedHierarchy,
    find(n => n.name === nodeName),
  ])

  if (!node) throw new NotFoundError(`Cannot find node ${nodeName}`)

  return `${node.nodeId}-${id}`
}

export const setCustomId = app => (record, id) => {
  record.id = customId(app)(record.type, id)

  const keyParts = splitKey(record.key)

  record.key = $(keyParts, [
    take(keyParts.length - 1),
    union([record.id]),
    joinKey,
  ])

  return record
}
