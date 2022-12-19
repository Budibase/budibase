import { AccountPlan, Quotas, Feature, Billing } from "."

export interface License {
  features: Feature[]
  quotas: Quotas
  plan: AccountPlan
  billing?: Billing
}
