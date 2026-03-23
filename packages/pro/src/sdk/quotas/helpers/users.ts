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
  // Skip quota and license sync when user and creator counts do not change.
  // This keeps role-only updates from triggering expensive license refreshes.
  if (change === 0 && changeCreator === 0) {
    return addUsersFn ? await addUsersFn() : (undefined as T)
  }

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

  // Run license sync in the background so user operations are not blocked.
  Promise.resolve(licenseClient.getLicense()).catch(err => {
    console.log("Failed to sync license after adding users", err)
  })

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

  // Run license sync in the background so user operations are not blocked.
  Promise.resolve(licenseClient.getLicense()).catch(err => {
    console.log("Failed to sync license after removing users", err)
  })
}
