export interface AccountPlan {
  type: PlanType
  price?: Price
}

export enum PlanType {
  FREE = "free",
  /** @deprecated */
  PRO = "pro",
  /** @deprecated */
  TEAM = "team",
  PREMIUM = "premium",
  BUSINESS = "business",
  ENTERPRISE = "enterprise",
}

export enum PriceDuration {
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

export interface Price {
  amount: number
  amountMonthly: number
  currency: string
  duration: PriceDuration
  priceId: string
  dayPasses: number
  isPerUser: boolean
}
