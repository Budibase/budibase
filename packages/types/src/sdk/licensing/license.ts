import { PurchasedPlan, Quotas, Feature, Billing } from "."

export interface OfflineIdentifier {
  installId: string,
  tenantId: string
}

// export interface OfflineLicense extends License {
//   identifier?: OfflineIdentifier
//   identifierBase64: string
// }

export interface License {
  features: Feature[]
  quotas: Quotas
  plan: PurchasedPlan
  billing?: Billing
  testClockId?: string
}
