<script>
  import {
    Body,
    Divider,
    Heading,
    Layout,
    notifications,
    Detail,
    Link,
    TooltipWrapper,
  } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { admin, auth, licensing } from "@/stores/portal"
  import { Constants } from "@budibase/frontend-core"
  import { DashCard, Usage } from "@/components/usage"
  import { PlanModel } from "@/constants"
  import { sdk } from "@budibase/shared-core"
  import { getFormattedPlanName } from "@/helpers/planTitle"

  let staticUsage = []
  let monthlyUsage = []
  let cancelAt
  let loaded = false
  let textRows = []
  let daysRemainingInMonth
  let primaryActionText

  const upgradeUrl = `${$admin.accountPortalUrl}/portal/upgrade`
  const manageUrl = `${$admin.accountPortalUrl}/portal/billing`

  const WARN_USAGE = ["Queries", "Automations", "Rows", "Users"]
  const oneDayInSeconds = 86400

  const EXCLUDE_QUOTAS = {
    Queries: () => true,
    Users: license => {
      return license.plan.model !== PlanModel.PER_USER
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
          monthlyUsage.push({
            name: value.name,
            used: used ? used : 0,
            total: value.value,
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
          name: value.name,
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
    if (license?.plan.type === Constants.PlanType.FREE) {
      primaryActionText = "Upgrade"
      return
    }

    if (cancelAt) {
      primaryActionText = "Renew"
    } else {
      primaryActionText = "Manage"
    }
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
    <Layout noPadding gap="XS">
      <Heading>Usage</Heading>
      <Body>
        <div>Get information about your current usage within Budibase</div>
      </Body>
    </Layout>
    <Divider />
    {#if canManagePlan}
      <Body>
        To upgrade your plan and usage limits visit your
        <Link size="L" on:click={goToAccountPortal}>account</Link>.
      </Body>
    {:else}
      <Body>Contact your account holder to upgrade your plan.</Body>
    {/if}

    <DashCard
      description="YOUR CURRENT PLAN"
      title={getFormattedPlanName(license?.plan.type)}
      {primaryActionText}
      primaryAction={showButton ? goToAccountPortal : undefined}
      {textRows}
    >
      <div class="content">
        <div class="column">
          <Layout noPadding>
            {#each staticUsage as usage}
              <div class="usage">
                <Usage {usage} warnWhenFull={WARN_USAGE.includes(usage.name)} />
              </div>
            {/each}
            <Layout gap="XS" noPadding>
              <Heading size="S">Monthly limits</Heading>
              <div class="detail">
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
          </Layout>
        </div>
      </div>
    </DashCard>
  </Layout>
{/if}

<style>
  .content {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 40px;
    flex-wrap: wrap;
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
</style>
