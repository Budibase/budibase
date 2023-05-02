import {
  Billing,
  Customer,
  Feature,
  License,
  PlanModel,
  PlanType,
  PriceDuration,
  PurchasedPlan,
  PurchasedPrice,
  Quotas,
  Subscription,
} from "@budibase/types"

export function price(): PurchasedPrice {
  return {
    amount: 10000,
    amountMonthly: 10000,
    currency: "usd",
    duration: PriceDuration.MONTHLY,
    priceId: "price_123",
    dayPasses: undefined,
    isPerUser: true,
  }
}

export const plan = (type: PlanType = PlanType.FREE): PurchasedPlan => {
  return {
    type,
    usesInvoicing: false,
    model: PlanModel.PER_USER,
    price: price(),
  }
}

export function quotas(): Quotas {
  return {
    usage: {
      monthly: {
        queries: {
          name: "Queries",
          value: 1,
          triggers: [],
        },
        automations: {
          name: "Queries",
          value: 1,
          triggers: [],
        },
        dayPasses: {
          name: "Queries",
          value: 1,
          triggers: [],
        },
      },
      static: {
        rows: {
          name: "Rows",
          value: 1,
          triggers: [],
        },
        apps: {
          name: "Apps",
          value: 1,
          triggers: [],
        },
        users: {
          name: "Users",
          value: 1,
          triggers: [],
        },
        userGroups: {
          name: "User Groups",
          value: 1,
          triggers: [],
        },
        plugins: {
          name: "Plugins",
          value: 1,
          triggers: [],
        },
      },
    },
    constant: {
      automationLogRetentionDays: {
        name: "Automation Logs",
        value: 1,
        triggers: [],
      },
      appBackupRetentionDays: {
        name: "Backups",
        value: 1,
        triggers: [],
      },
    },
  }
}

export function billing(
  opts: { customer?: Customer; subscription?: Subscription } = {}
): Billing {
  return {
    customer: opts.customer || customer(),
    subscription: opts.subscription || subscription(),
  }
}

export function customer(): Customer {
  return {
    balance: 0,
    currency: "usd",
  }
}

export function subscription(): Subscription {
  return {
    amount: 10000,
    cancelAt: undefined,
    currency: "usd",
    currentPeriodEnd: 0,
    currentPeriodStart: 0,
    downgradeAt: 0,
    duration: PriceDuration.MONTHLY,
    pastDueAt: undefined,
    quantity: 0,
    status: "active",
  }
}

export const license = (
  opts: {
    quotas?: Quotas
    plan?: PurchasedPlan
    planType?: PlanType
    features?: Feature[]
    billing?: Billing
  } = {}
): License => {
  return {
    features: opts.features || [],
    quotas: opts.quotas || quotas(),
    plan: opts.plan || plan(opts.planType),
    billing: opts.billing || billing(),
  }
}
