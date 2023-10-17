import { PriceDuration } from "./plan"

export interface Customer {
  balance: number | null | undefined
  currency: string | null | undefined
}

export interface Subscription {
  amount: number
  currency: string
  quantity: number
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
