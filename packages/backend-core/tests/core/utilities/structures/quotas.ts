import { MonthlyQuotaName, QuotaUsage } from "@budibase/types"

export const usage = (): QuotaUsage => {
  return {
    _id: "usage_quota",
    quotaReset: new Date().toISOString(),
    apps: {
      app_1: {
        // @ts-ignore - the apps definition doesn't match up to actual usage
        usageQuota: {
          rows: 0,
        },
      },
    },
    monthly: {
      "01-2023": {
        automations: 0,
        dayPasses: 0,
        queries: 0,
        triggers: {},
        breakdown: {
          rowQueries: {
            parent: MonthlyQuotaName.QUERIES,
            values: {
              row_1: 0,
              row_2: 0,
            },
          },
          datasourceQueries: {
            parent: MonthlyQuotaName.QUERIES,
            values: {
              ds_1: 0,
              ds_2: 0,
            },
          },
          automations: {
            parent: MonthlyQuotaName.AUTOMATIONS,
            values: {
              auto_1: 0,
              auto_2: 0,
            },
          },
        },
      },
      "02-2023": {
        automations: 0,
        dayPasses: 0,
        queries: 0,
        triggers: {},
      },
      current: {
        automations: 0,
        dayPasses: 0,
        queries: 0,
        triggers: {},
      },
    },
    usageQuota: {
      apps: 0,
      plugins: 0,
      users: 0,
      userGroups: 0,
      rows: 0,
      triggers: {},
    },
  }
}
