export enum PlanType {
  FREE = "free",
  PRO = "pro",
  PRO_MAX = "pro_max",
  /** @deprecated */
  TEAM = "team",
  /** @deprecated */
  PREMIUM = "premium",
  PREMIUM_PLUS = "premium_plus",
  PREMIUM_MAX = "premium_max",
  PREMIUM_PLUS_TRIAL = "premium_plus_trial",
  BUSINESS = "business",
  ENTERPRISE_BASIC = "enterprise_basic",
  ENTERPRISE_BASIC_TRIAL = "enterprise_basic_trial",
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
  type?: string
}

export enum PlanModel {
  PER_USER = "perUser",
  PER_CREATOR_PER_USER = "per_creator_per_user",
}

export interface PurchasedPlan {
  type: PlanType
  model: PlanModel
  usesInvoicing: boolean
  price?: PurchasedPrice
}

export interface PurchasedPrice extends AvailablePrice {
  /** @deprecated - now at the plan level via model */
  isPerUser: boolean
}
