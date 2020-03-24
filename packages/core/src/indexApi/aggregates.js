import { has, isNumber, isUndefined } from "lodash/fp"
import { compileCode } from "../common/compileCode"
import { safeKey, apiWrapper, events, isNonEmptyString } from "../common"
import { iterateIndex } from "../indexing/read"
import {
  getUnshardedIndexDataKey,
  getShardKeysInRange,
} from "../indexing/sharding"
import {
  getExactNodeForKey,
  isIndex,
  isShardedIndex,
} from "../templateApi/hierarchy"
import { CONTINUE_READING_RECORDS } from "../indexing/serializer"
import { permission } from "../authApi/permissions"
import { BadRequestError } from "../common/errors"
import { getIndexDir } from "./getIndexDir"

export const aggregates = app => async (
  indexKey,
  rangeStartParams = null,
  rangeEndParams = null
) =>
  apiWrapper(
    app,
    events.indexApi.aggregates,
    permission.readIndex.isAuthorized(indexKey),
    { indexKey, rangeStartParams, rangeEndParams },
    _aggregates,
    app,
    indexKey,
    rangeStartParams,
    rangeEndParams
  )

const _aggregates = async (app, indexKey, rangeStartParams, rangeEndParams) => {
  indexKey = safeKey(indexKey)
  const indexNode = getExactNodeForKey(app.hierarchy)(indexKey)
  const indexDir = getIndexDir(app.hierarchy, indexKey)

  if (!isIndex(indexNode)) {
    throw new BadRequestError("supplied key is not an index")
  }

  if (isShardedIndex(indexNode)) {
    const shardKeys = await getShardKeysInRange(
      app,
      indexNode,
      indexDir,
      rangeStartParams,
      rangeEndParams
    )
    let aggregateResult = null
    for (const k of shardKeys) {
      const shardResult = await getAggregates(
        app.hierarchy,
        app.datastore,
        indexNode,
        k
      )
      if (aggregateResult === null) {
        aggregateResult = shardResult
      } else {
        aggregateResult = mergeShardAggregate(aggregateResult, shardResult)
      }
    }
    return aggregateResult
  }
  return await getAggregates(
    app.hierarchy,
    app.datastore,
    indexNode,
    getUnshardedIndexDataKey(indexDir)
  )
}

const mergeShardAggregate = (totals, shard) => {
  const mergeGrouping = (tot, shr) => {
    tot.count += shr.count
    for (const aggName in tot) {
      if (aggName === "count") continue
      const totagg = tot[aggName]
      const shragg = shr[aggName]
      totagg.sum += shragg.sum
      totagg.max = totagg.max > shragg.max ? totagg.max : shragg.max
      totagg.min = totagg.min < shragg.min ? totagg.min : shragg.min
      totagg.mean = totagg.sum / tot.count
    }
    return tot
  }

  for (const aggGroupDef in totals) {
    for (const grouping in shard[aggGroupDef]) {
      const groupingTotal = totals[aggGroupDef][grouping]
      totals[aggGroupDef][grouping] = isUndefined(groupingTotal)
        ? shard[aggGroupDef][grouping]
        : mergeGrouping(
            totals[aggGroupDef][grouping],
            shard[aggGroupDef][grouping]
          )
    }
  }

  return totals
}

const getAggregates = async (hierarchy, datastore, index, indexedDataKey) => {
  const aggregateResult = {}
  const doRead = iterateIndex(
    async item => {
      applyItemToAggregateResult(index, aggregateResult, item)
      return CONTINUE_READING_RECORDS
    },
    async () => aggregateResult
  )

  return await doRead(hierarchy, datastore, index, indexedDataKey)
}

const applyItemToAggregateResult = (indexNode, result, item) => {
  const getInitialAggregateResult = () => ({
    sum: 0,
    mean: null,
    max: null,
    min: null,
  })

  const applyAggregateResult = (agg, existing, count) => {
    const value = compileCode(agg.aggregatedValue)({ record: item })

    if (!isNumber(value)) return existing

    existing.sum += value
    existing.max =
      value > existing.max || existing.max === null ? value : existing.max
    existing.min =
      value < existing.min || existing.min === null ? value : existing.min
    existing.mean = existing.sum / count
    return existing
  }

  for (const aggGroup of indexNode.aggregateGroups) {
    if (!has(aggGroup.name)(result)) {
      result[aggGroup.name] = {}
    }

    const thisGroupResult = result[aggGroup.name]

    if (isNonEmptyString(aggGroup.condition)) {
      if (!compileCode(aggGroup.condition)({ record: item })) {
        continue
      }
    }

    let group = isNonEmptyString(aggGroup.groupBy)
      ? compileCode(aggGroup.groupBy)({ record: item })
      : "all"
    if (!isNonEmptyString(group)) {
      group = "(none)"
    }

    if (!has(group)(thisGroupResult)) {
      thisGroupResult[group] = { count: 0 }
      for (const agg of aggGroup.aggregates) {
        thisGroupResult[group][agg.name] = getInitialAggregateResult()
      }
    }

    thisGroupResult[group].count++

    for (const agg of aggGroup.aggregates) {
      const existingValues = thisGroupResult[group][agg.name]
      thisGroupResult[group][agg.name] = applyAggregateResult(
        agg,
        existingValues,
        thisGroupResult[group].count
      )
    }
  }
}
