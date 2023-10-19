export enum FeatureFlag {
  LICENSING = "LICENSING",
  // Feature IDs in Posthog
  PER_CREATOR_PER_USER_PRICE = "18873",
  PER_CREATOR_PER_USER_PRICE_ALERT = "18530",
}

export interface TenantFeatureFlags {
  [key: string]: FeatureFlag[]
}
