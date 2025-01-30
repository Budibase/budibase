import { get } from "svelte/store"
import { API } from "@/api"
import { auth, admin } from "@/stores/portal"
import { Constants } from "@budibase/frontend-core"
import { StripeStatus } from "@/components/portal/licensing/constants"
import {
  License,
  MonthlyQuotaName,
  PlanModel,
  QuotaUsage,
  StaticQuotaName,
} from "@budibase/types"
import { BudiStore } from "../BudiStore"

const UNLIMITED = -1
const ONE_DAY_MILLIS = 86400000

type MonthlyMetrics = { [key in MonthlyQuotaName]?: number }
type StaticMetrics = { [key in StaticQuotaName]?: number }
type UsageMetrics = MonthlyMetrics & StaticMetrics

interface LicensingState {
  goToUpgradePage: () => void
  goToPricingPage: () => void
  // the top level license
  license?: License
  isFreePlan: boolean
  isEnterprisePlan: boolean
  isBusinessPlan: boolean
  // features
  groupsEnabled: boolean
  backupsEnabled: boolean
  brandingEnabled: boolean
  scimEnabled: boolean
  environmentVariablesEnabled: boolean
  budibaseAIEnabled: boolean
  customAIConfigsEnabled: boolean
  auditLogsEnabled: boolean
  // the currently used quotas from the db
  quotaUsage?: QuotaUsage
  // derived quota metrics for percentages used
  usageMetrics?: UsageMetrics
  // quota reset
  quotaResetDaysRemaining?: number
  quotaResetDate?: Date
  // failed payments
  accountPastDue: boolean
  pastDueEndDate?: Date
  pastDueDaysRemaining?: number
  accountDowngraded: boolean
  // user limits
  userCount?: number
  userLimit?: number
  userLimitReached: boolean
  errUserLimit: boolean
}

class LicensingStore extends BudiStore<LicensingState> {
  constructor() {
    super({
      // navigation
      goToUpgradePage: () => {},
      goToPricingPage: () => {},
      // the top level license
      license: undefined,
      isFreePlan: true,
      isEnterprisePlan: true,
      isBusinessPlan: true,
      // features
      groupsEnabled: false,
      backupsEnabled: false,
      brandingEnabled: false,
      scimEnabled: false,
      environmentVariablesEnabled: false,
      budibaseAIEnabled: false,
      customAIConfigsEnabled: false,
      auditLogsEnabled: false,
      // the currently used quotas from the db
      quotaUsage: undefined,
      // derived quota metrics for percentages used
      usageMetrics: undefined,
      // quota reset
      quotaResetDaysRemaining: undefined,
      quotaResetDate: undefined,
      // failed payments
      accountPastDue: false,
      pastDueEndDate: undefined,
      pastDueDaysRemaining: undefined,
      accountDowngraded: false,
      // user limits
      userCount: undefined,
      userLimit: undefined,
      userLimitReached: false,
      errUserLimit: false,
    })
  }

  usersLimitReached(userCount: number, userLimit = get(this.store).userLimit) {
    if (userLimit === UNLIMITED || userLimit === undefined) {
      return false
    }
    return userCount >= userLimit
  }

  usersLimitExceeded(userCount: number, userLimit = get(this.store).userLimit) {
    if (userLimit === UNLIMITED || userLimit === undefined) {
      return false
    }
    return userCount > userLimit
  }

  async isCloud() {
    let adminStore = get(admin)
    if (!adminStore.loaded) {
      await admin.init()
      adminStore = get(admin)
    }
    return adminStore.cloud
  }

  async init() {
    this.setNavigation()
    this.setLicense()
    await this.setQuotaUsage()
  }

  setNavigation() {
    const adminStore = get(admin)
    const authStore = get(auth)

    const upgradeUrl = authStore?.user?.accountPortalAccess
      ? `${adminStore.accountPortalUrl}/portal/upgrade`
      : "/builder/portal/account/upgrade"

    const goToUpgradePage = () => {
      window.location.href = upgradeUrl
    }
    const goToPricingPage = () => {
      window.open("https://budibase.com/pricing/", "_blank")
    }
    this.update(state => {
      return {
        ...state,
        goToUpgradePage,
        goToPricingPage,
      }
    })
  }

  setLicense() {
    const license = get(auth).user?.license
    const planType = license?.plan.type
    const features = license?.features || []
    const isEnterprisePlan = planType === Constants.PlanType.ENTERPRISE
    const isFreePlan = planType === Constants.PlanType.FREE
    const isBusinessPlan = planType === Constants.PlanType.BUSINESS
    const isEnterpriseTrial =
      planType === Constants.PlanType.ENTERPRISE_BASIC_TRIAL
    const groupsEnabled = features.includes(Constants.Features.USER_GROUPS)
    const backupsEnabled = features.includes(Constants.Features.APP_BACKUPS)
    const scimEnabled = features.includes(Constants.Features.SCIM)
    const environmentVariablesEnabled = features.includes(
      Constants.Features.ENVIRONMENT_VARIABLES
    )
    const enforceableSSO = features.includes(Constants.Features.ENFORCEABLE_SSO)
    const brandingEnabled = features.includes(Constants.Features.BRANDING)
    const auditLogsEnabled = features.includes(Constants.Features.AUDIT_LOGS)
    const syncAutomationsEnabled = features.includes(
      Constants.Features.SYNC_AUTOMATIONS
    )
    const triggerAutomationRunEnabled = features.includes(
      Constants.Features.TRIGGER_AUTOMATION_RUN
    )
    const perAppBuildersEnabled = features.includes(
      Constants.Features.APP_BUILDERS
    )
    const budibaseAIEnabled = features.includes(Constants.Features.BUDIBASE_AI)
    const customAIConfigsEnabled = features.includes(
      Constants.Features.AI_CUSTOM_CONFIGS
    )
    this.update(state => {
      return {
        ...state,
        license,
        isEnterprisePlan,
        isFreePlan,
        isBusinessPlan,
        isEnterpriseTrial,
        groupsEnabled,
        backupsEnabled,
        brandingEnabled,
        budibaseAIEnabled,
        customAIConfigsEnabled,
        scimEnabled,
        environmentVariablesEnabled,
        auditLogsEnabled,
        enforceableSSO,
        syncAutomationsEnabled,
        triggerAutomationRunEnabled,
        perAppBuildersEnabled,
      }
    })
  }

  async setQuotaUsage() {
    const quotaUsage = await API.getQuotaUsage()
    this.update(state => {
      return {
        ...state,
        quotaUsage,
      }
    })
    await this.setUsageMetrics()
  }

  async setUsageMetrics() {
    const usage = get(this.store).quotaUsage
    const license = get(auth).user?.license
    const now = new Date()
    if (!license || !usage) {
      return
    }

    // Process monthly metrics
    const monthlyMetrics = [
      MonthlyQuotaName.QUERIES,
      MonthlyQuotaName.AUTOMATIONS,
    ].reduce((acc: MonthlyMetrics, key) => {
      const limit = license.quotas.usage.monthly[key].value
      const used = ((usage.monthly.current?.[key] || 0) / limit) * 100
      acc[key] = limit > -1 ? Math.floor(used) : -1
      return acc
    }, {})

    // Process static metrics
    const staticMetrics = [StaticQuotaName.APPS, StaticQuotaName.ROWS].reduce(
      (acc: StaticMetrics, key) => {
        const limit = license.quotas.usage.static[key].value
        const used = ((usage.usageQuota[key] || 0) / limit) * 100
        acc[key] = limit > -1 ? Math.floor(used) : -1
        return acc
      },
      {}
    )

    const getDaysBetween = (dateStart: Date, dateEnd: Date) => {
      return dateEnd > dateStart
        ? Math.round((dateEnd.getTime() - dateStart.getTime()) / ONE_DAY_MILLIS)
        : 0
    }

    const quotaResetDate = new Date(usage.quotaReset)
    const quotaResetDaysRemaining = getDaysBetween(now, quotaResetDate)

    const accountDowngraded =
      !!license.billing?.subscription?.downgradeAt &&
      license.billing?.subscription?.downgradeAt <= now.getTime() &&
      license.billing?.subscription?.status === StripeStatus.PAST_DUE &&
      license.plan.type === Constants.PlanType.FREE

    const pastDueAtMilliseconds = license.billing?.subscription?.pastDueAt
    const downgradeAtMilliseconds = license.billing?.subscription?.downgradeAt
    let pastDueDaysRemaining: number
    let pastDueEndDate: Date

    if (pastDueAtMilliseconds && downgradeAtMilliseconds) {
      pastDueEndDate = new Date(downgradeAtMilliseconds)
      pastDueDaysRemaining = getDaysBetween(
        new Date(pastDueAtMilliseconds),
        pastDueEndDate
      )
    }

    const userQuota = license.quotas.usage.static.users
    const userLimit = userQuota.value
    const userCount = usage.usageQuota.users
    const userLimitReached = this.usersLimitReached(userCount, userLimit)
    const userLimitExceeded = this.usersLimitExceeded(userCount, userLimit)
    const isCloudAccount = await this.isCloud()
    const errUserLimit =
      isCloudAccount &&
      license.plan.model === PlanModel.PER_USER &&
      userLimitExceeded

    this.update(state => {
      return {
        ...state,
        usageMetrics: { ...monthlyMetrics, ...staticMetrics },
        quotaResetDaysRemaining,
        quotaResetDate,
        accountDowngraded,
        accountPastDue: pastDueAtMilliseconds != null,
        pastDueEndDate,
        pastDueDaysRemaining,
        // user limits
        userCount,
        userLimit,
        userLimitReached,
        errUserLimit,
      }
    })
  }
}

export const licensing = new LicensingStore()
