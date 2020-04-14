import {
  findRoot,
  getFlattenedHierarchy,
  fieldReversesReferenceToIndex,
  isModel,
} from "./hierarchy"
import { $ } from "../common"
import { map, filter, reduce } from "lodash/fp"

export const canDeleteIndex = indexNode => {
  const flatHierarchy = $(indexNode, [findRoot, getFlattenedHierarchy])

  const reverseIndexes = $(flatHierarchy, [
    filter(isModel),
    reduce((obj, r) => {
      for (let field of r.fields) {
        if (fieldReversesReferenceToIndex(indexNode)(field)) {
          obj.push({ ...field, record: r })
        }
      }
      return obj
    }, []),
    map(
      f =>
        `field "${f.name}" on record "${f.record.name}" uses this index as a reference`
    ),
  ])

  const lookupIndexes = $(flatHierarchy, [
    filter(isModel),
    reduce((obj, r) => {
      for (let field of r.fields) {
        if (
          field.type === "reference" &&
          field.typeOptions.indexNodeKey === indexNode.nodeKey()
        ) {
          obj.push({ ...field, record: r })
        }
      }
      return obj
    }, []),
    map(
      f =>
        `field "${f.name}" on record "${f.record.name}" uses this index as a lookup`
    ),
  ])

  const errors = [...reverseIndexes, ...lookupIndexes]

  return {
    canDelete: errors.length === 0,
    errors,
  }
}
