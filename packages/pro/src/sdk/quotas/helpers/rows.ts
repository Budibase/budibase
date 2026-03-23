import * as quotas from "./../quotas"
import { QuotaUsageType, StaticQuotaName } from "@budibase/types"

type RowOpts = {
  tableId?: string
}

export const addRow = async (addRowFn: any, { tableId }: RowOpts = {}) => {
  return quotas.increment(StaticQuotaName.ROWS, QuotaUsageType.STATIC, {
    fn: addRowFn,
    id: tableId,
  })
}

export const removeRow = async ({ tableId }: RowOpts = {}) => {
  return quotas.decrement(StaticQuotaName.ROWS, QuotaUsageType.STATIC, {
    id: tableId,
  })
}

export const addRows = async (
  change: number,
  addRowsFn?: () => Promise<any>,
  { tableId }: RowOpts = {}
) => {
  return quotas.incrementMany({
    change,
    name: StaticQuotaName.ROWS,
    type: QuotaUsageType.STATIC,
    opts: { fn: addRowsFn, id: tableId },
  })
}

export const removeRows = async (change: number, { tableId }: RowOpts = {}) => {
  return quotas.decrementMany({
    change,
    name: StaticQuotaName.ROWS,
    type: QuotaUsageType.STATIC,
    opts: { id: tableId },
  })
}
