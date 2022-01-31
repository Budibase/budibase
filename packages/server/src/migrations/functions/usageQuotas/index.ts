const { useQuotas } = require("../../../utilities/usageQuota")

export const runQuotaMigration = async (migration: Function) => {
  if (!useQuotas()) {
    return
  }
  await migration()
}
