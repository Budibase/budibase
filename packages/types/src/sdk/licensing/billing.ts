import { PriceDuration } from "./plan"

export interface CustomerBilling {
  balance: number | null | undefined
  currency: string | null | undefined
}

export interface SubscriptionBilling {
  amount: number
  quantity: number
  duration: PriceDuration
  cancelAt: number | null | undefined
  currentPeriodStart: number
  currentPeriodEnd: number
}

export interface Billing {
  customer: CustomerBilling
  subscription?: SubscriptionBilling
}
