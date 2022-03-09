import * as Pro from "@budibase/pro"

export const runQuotaMigration = async (migration: Function) => {
  if (!Pro.Licensing.Quotas.useQuotas()) {
    return
  }
  await migration()
}
