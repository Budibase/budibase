import { PurchasedPlan, Quotas, Feature, Billing } from "."

export interface License {
  features: Feature[]
  quotas: Quotas
  plan: PurchasedPlan
  billing?: Billing
  testClockId?: string
}
