import { PriceDuration } from "./plan"

export interface Customer {
  balance: number | null | undefined
  currency: string | null | undefined
}

export interface Subscription {
  amount: number
  quantity: number
  duration: PriceDuration
  cancelAt: number | null | undefined
  currentPeriodStart: number
  currentPeriodEnd: number
}

export interface Billing {
  customer: Customer
  subscription?: Subscription
}
