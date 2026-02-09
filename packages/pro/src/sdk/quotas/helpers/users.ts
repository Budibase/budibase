import * as quotas from "../quotas"
import { QuotaUsageType, StaticQuotaName } from "@budibase/types"
import { users } from "@budibase/backend-core"
import * as licenseClient from "../../licensing/licenses/client"
import { IncrementManyParams } from "../quotas"

export const addUsers = async <T>(
  change: number,
  changeCreator: number,
  addUsersFn?: () => Promise<T>
): Promise<T> => {
  const quotasToChange: IncrementManyParams[] = [
    {
      change,
      name: StaticQuotaName.USERS,
      type: QuotaUsageType.STATIC,
      opts: {
        fn: addUsersFn,
        valueFn: users.getUserCount,
      },
    },
  ]

  if (changeCreator > 0) {
    quotasToChange.push({
      change: changeCreator,
      name: StaticQuotaName.CREATORS,
      type: QuotaUsageType.STATIC,
      opts: {
        valueFn: users.getCreatorCount,
      },
    })
  }

  const res = await quotas.incrementMany(quotasToChange)

  // send a get license request to sync the user count to the account
  await licenseClient.getLicense()

  return res
}

export const removeUsers = async (change: number, changeCreator: number) => {
  const quotasToChange: IncrementManyParams[] = [
    {
      change,
      name: StaticQuotaName.USERS,
      type: QuotaUsageType.STATIC,
      opts: {
        valueFn: users.getUserCount,
      },
    },
  ]

  if (changeCreator > 0) {
    quotasToChange.push({
      change: changeCreator,
      name: StaticQuotaName.CREATORS,
      type: QuotaUsageType.STATIC,
      opts: {
        valueFn: users.getCreatorCount,
      },
    })
  }

  await quotas.decrementMany(quotasToChange)

  // send a get license request to sync the user count to the account
  await licenseClient.getLicense()
}
