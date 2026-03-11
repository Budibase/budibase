<script>
  import {
    Body,
    Heading,
    Layout,
    notifications,
    Detail,
    Link,
    TooltipWrapper,
    Button,
  } from "@budibase/bbui"
  import { Feature } from "@budibase/types"
  import { onMount } from "svelte"
  import { admin } from "@/stores/portal/admin"
  import { auth } from "@/stores/portal/auth"
  import { licensing } from "@/stores/portal/licensing"
  import { Constants } from "@budibase/frontend-core"
  import { Usage } from "@/components/usage"
  import { PlanModel } from "@/constants"
  import { sdk, helpers } from "@budibase/shared-core"
  import { getFormattedPlanName } from "@/helpers/planTitle"

  let staticUsage = []
  let monthlyUsage = []
  let cancelAt
  let loaded = false
  let textRows = []
  let daysRemainingInMonth
  let primaryActionText

  const { accountPortalUpgradeUrl, accountPortalBillingUrl } = helpers

  $: upgradeUrl = accountPortalUpgradeUrl($admin.accountPortalUrl)
  $: manageUrl = accountPortalBillingUrl($admin.accountPortalUrl)

  const WARN_USAGE = ["Queries", "Automations", "Rows", "Users"]
  const oneDayInSeconds = 86400

  const EXCLUDE_QUOTAS = {
    ["Day Passes"]: () => true,
    [Feature.AI_CUSTOM_CONFIGS]: () => true,
    Queries: () => true,
    Automations: () => true,
    Creators: license => {
      return license.plan.model === PlanModel.PER_USER
    },
  }

  function excludeQuota(name) {
    return EXCLUDE_QUOTAS[name] && EXCLUDE_QUOTAS[name](license)
  }

  $: quotaUsage = $licensing.quotaUsage

  $: license = $auth.user?.license
  $: plan = license?.plan
  $: usesInvoicing = plan?.usesInvoicing

  $: accountPortalAccess = $auth?.user?.accountPortalAccess
  $: quotaReset = quotaUsage?.quotaReset
  $: canManagePlan =
    ($admin.cloud && accountPortalAccess) ||
    (!$admin.cloud && sdk.users.isAdmin($auth.user))

  $: showButton = !usesInvoicing && accountPortalAccess

  const setMonthlyUsage = () => {
    monthlyUsage = []
    if (quotaUsage.monthly) {
      for (let [key, value] of Object.entries(license.quotas.usage.monthly)) {
        if (excludeQuota(value.name)) {
          continue
        }
        const used = quotaUsage.monthly.current[key]
        if (value.value !== 0) {
          const isAICredits = value.name === "Budibase AI Credits"
          monthlyUsage.push({
            name: value.name === "Actions" ? "Operations" : value.name,
            used: isAICredits ? Math.floor((used ?? 0) / 1000) : (used ?? 0),
            total: isAICredits ? Math.floor(value.value / 1000) : value.value,
          })
        }
      }
    }
    monthlyUsage = monthlyUsage.sort((a, b) => a.name.localeCompare(b.name))
  }

  const setStaticUsage = () => {
    staticUsage = []
    for (let [key, value] of Object.entries(license.quotas.usage.static)) {
      if (excludeQuota(value.name)) {
        continue
      }
      const used = quotaUsage.usageQuota[key]
      if (value.value !== 0) {
        staticUsage.push({
          name: value.name === "Apps" ? "Workspaces" : value.name,
          used: used ? used : 0,
          total: value.value,
        })
      }
    }
    staticUsage = staticUsage.sort((a, b) => a.name.localeCompare(b.name))
  }

  const setCancelAt = () => {
    cancelAt = license?.billing?.subscription?.cancelAt
  }

  const getDaysRemaining = timestamp => {
    if (!timestamp) {
      return
    }
    const diffTime = Math.abs(timestamp - new Date().getTime()) / 1000
    return Math.floor(diffTime / oneDayInSeconds)
  }

  const setTextRows = () => {
    textRows = []

    if (cancelAt && !usesInvoicing) {
      if (plan?.type !== Constants.PlanType.ENTERPRISE_BASIC_TRIAL) {
        textRows.push({ message: "Subscription has been cancelled" })
      }
      textRows.push({
        message: `${getDaysRemaining(cancelAt)} days remaining`,
        tooltip: new Date(cancelAt),
      })
    }
  }

  const setDaysRemainingInMonth = () => {
    const resetDate = new Date(quotaReset)

    const now = new Date()
    const difference = resetDate.getTime() - now.getTime()

    // return the difference in days
    daysRemainingInMonth = (difference / (1000 * 3600 * 24)).toFixed(0)
  }

  const goToAccountPortal = () => {
    if (license?.plan.type === Constants.PlanType.FREE) {
      window.location.href = upgradeUrl
    } else {
      window.location.href = manageUrl
    }
  }

  const setPrimaryActionText = () => {
    if (
      [
        Constants.PlanType.FREE,
        Constants.PlanType.PREMIUM_PLUS_TRIAL,
        Constants.PlanType.ENTERPRISE_BASIC_TRIAL,
      ].includes(license?.plan.type)
    ) {
      primaryActionText = "Upgrade"
      return
    }

    primaryActionText = cancelAt ? "Renew" : "Manage"
  }

  const init = async () => {
    try {
      // always load latest
      await licensing.init()
    } catch (e) {
      console.error(e)
      notifications.error(e)
    }
  }

  onMount(async () => {
    await init()
    loaded = true
  })

  $: {
    if (license) {
      setPrimaryActionText()
      setCancelAt()
      setTextRows()
      setDaysRemainingInMonth()

      if (quotaUsage) {
        setMonthlyUsage()
        setStaticUsage()
      }
    }
  }
</script>

{#if loaded}
  <Layout noPadding>
    <div class="usage-heading">
      <div>
        <div class="usage-title">
          <Detail size="S">YOUR CURRENT PLAN</Detail>
        </div>
        <Heading size="S">{getFormattedPlanName(license?.plan.type)}</Heading>
      </div>
      {#if showButton}
        <div>
          <Button on:click={goToAccountPortal}>{primaryActionText}</Button>
        </div>
      {/if}
    </div>

    {#if canManagePlan}
      <Body size="S">
        To upgrade your plan and usage limits visit your
        <Link size="L" on:click={goToAccountPortal}>account</Link>.
      </Body>
    {:else}
      <Body>Contact your account holder to upgrade your plan.</Body>
    {/if}

    <div class="content">
      <div class="column">
        <Layout noPadding>
          <div class="monthly-section">
            <Layout gap="XS" noPadding>
              <Heading size="XS">Monthly limits</Heading>
              <div class="detail monthly-reset">
                <TooltipWrapper tooltip={new Date(quotaReset)}>
                  <Detail size="M">
                    Resets in {daysRemainingInMonth} days
                  </Detail>
                </TooltipWrapper>
              </div>
            </Layout>
            <Layout noPadding gap="M">
              {#each monthlyUsage as usage}
                <Usage {usage} warnWhenFull={WARN_USAGE.includes(usage.name)} />
              {/each}
            </Layout>
          </div>
          <Heading size="XS">Static limits</Heading>

          {#each staticUsage as usage}
            <div class="usage">
              <Usage {usage} warnWhenFull={WARN_USAGE.includes(usage.name)} />
            </div>
          {/each}
        </Layout>
      </div>
    </div>
  </Layout>
{/if}

<style>
  .usage-heading {
    display: flex;
    width: 70%;
    justify-content: space-between;
    align-items: center;
  }
  .content {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 40px;
    flex-wrap: wrap;
    max-width: 70%;
  }
  .column {
    flex: 1 1 0;
  }
  .detail :global(.spectrum-Detail) {
    color: var(--spectrum-global-color-gray-700);
    margin-bottom: 5px;
  }
  .detail :global(.icon) {
    margin-bottom: 0;
  }
  .monthly-reset {
    margin-bottom: var(--spacing-xl);
  }
  .monthly-section {
    margin-bottom: var(--spacing-xl);
  }

  .usage-title :global(.spectrum-Detail) {
    color: var(
      --spectrum-sidenav-heading-text-color,
      var(--spectrum-global-color-gray-700)
    );
    display: inline-block;
    padding-bottom: var(--spacing-s);
  }
</style>
