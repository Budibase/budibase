export enum FeatureFlag {
  LICENSING = "LICENSING",
  PER_CREATOR_PER_USER_PRICE = "PER_CREATOR_PER_USER_PRICE",
  PER_CREATOR_PER_USER_PRICE_ALERT = "PER_CREATOR_PER_USER_PRICE_ALERT",
}

export interface TenantFeatureFlags {
  [key: string]: FeatureFlag[]
}
