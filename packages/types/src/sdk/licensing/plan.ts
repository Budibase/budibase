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

export interface AvailablePlan {
  type: PlanType
  maxUsers: number
  prices: AvailablePrice[]
}

export interface AvailablePrice {
  amount: number
  amountMonthly: number
  currency: string
  duration: PriceDuration
  priceId: string
}

export interface PurchasedPlan {
  type: PlanType
  price?: PurchasedPrice
}

export interface PurchasedPrice extends AvailablePrice {
  dayPasses: number
  isPerUser: boolean
}