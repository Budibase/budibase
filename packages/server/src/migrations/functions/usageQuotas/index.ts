import { quotas } from "@budibase/pro"

export const runQuotaMigration = async (migration: Function) => {
  if (!quotas.useQuotas()) {
    return
  }
  await migration()
}
