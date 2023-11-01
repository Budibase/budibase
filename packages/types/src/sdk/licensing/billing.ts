import { PriceDuration } from "./plan"

export interface Customer {
  balance: number | null | undefined
  currency: string | null | undefined
}

export interface SubscriptionItems {
  user: number | undefined
  creator: number | undefined
}

export interface Subscription {
  amount: number
  amounts: SubscriptionItems | undefined
  currency: string
  quantity: number
  quantities: SubscriptionItems | undefined
  duration: PriceDuration
  cancelAt: number | null | undefined
  currentPeriodStart: number
  currentPeriodEnd: number
  status: string
  pastDueAt?: number | null
  downgradeAt?: number
}

export interface Billing {
  customer: Customer
  subscription?: Subscription
}
