import type { PurchasedPlan, Quotas, Feature, Billing } from "."
import type { ISO8601 } from "../../shared"

export interface OfflineIdentifier {
  installId: string
  tenantId: string
}

export interface OfflineLicense extends License {
  identifier: OfflineIdentifier
  expireAt: ISO8601
}

export interface License {
  features: Feature[]
  quotas: Quotas
  plan: PurchasedPlan
  billing?: Billing
  testClockId?: string
}
