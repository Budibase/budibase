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
  import { admin, auth, licensing } from "../../../../stores/portal"
  import { PlanType } from "../../../../constants"
  import { DashCard, Usage } from "../../../../components/usage"

  let staticUsage = []
  let monthlyUsage = []
  let cancelAt
  let loaded = false
  let textRows = []
  let daysRemainingInMonth
  let primaryActionText

  const upgradeUrl = `${$admin.accountPortalUrl}/portal/upgrade`
  const manageUrl = `${$admin.accountPortalUrl}/portal/billing`

  const WARN_USAGE = ["Queries", "Automations", "Rows", "Day Passes"]
  const EXCLUDE_QUOTAS = ["Queries"]

  $: quotaUsage = $licensing.quotaUsage
  $: license = $auth.user?.license
  $: accountPortalAccess = $auth?.user?.accountPortalAccess
  $: quotaReset = quotaUsage?.quotaReset

  const setMonthlyUsage = () => {
    monthlyUsage = []
    if (quotaUsage.monthly) {
      for (let [key, value] of Object.entries(license.quotas.usage.monthly)) {
        if (EXCLUDE_QUOTAS.includes(value.name)) {
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
      if (EXCLUDE_QUOTAS.includes(value.name)) {
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

  const capitalise = string => {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  }

  const planTitle = () => {
    return capitalise(license?.plan.type)
  }

  const getDaysRemaining = timestamp => {
    if (!timestamp) {
      return
    }
    const now = new Date()
    now.setHours(0)
    now.setMinutes(0)

    const thenDate = new Date(timestamp)
    thenDate.setHours(0)
    thenDate.setMinutes(0)

    const difference = thenDate.getTime() - now
    // return the difference in days
    return (difference / (1000 * 3600 * 24)).toFixed(0)
  }

  const setTextRows = () => {
    textRows = []

    if (cancelAt) {
      textRows.push({ message: "Subscription has been cancelled" })
      textRows.push({
        message: `${getDaysRemaining(cancelAt * 1000)} days remaining`,
        tooltip: new Date(cancelAt * 1000),
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
    if (license?.plan.type === PlanType.FREE) {
      window.location.href = upgradeUrl
    } else {
      window.location.href = manageUrl
    }
  }

  const setPrimaryActionText = () => {
    if (license?.plan.type === PlanType.FREE) {
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
        Get information about your current usage within Budibase.
        {#if accountPortalAccess}
          To upgrade your plan and usage limits visit your <Link
            on:click={goToAccountPortal}
            size="L">Account</Link
          >
        {:else}
          To upgrade your plan and usage limits contact your account holder.
        {/if}
      </Body>
    </Layout>
    <Divider />
    <DashCard
      description="YOUR CURRENT PLAN"
      title={planTitle()}
      {primaryActionText}
      primaryAction={accountPortalAccess ? goToAccountPortal : undefined}
      {textRows}
    >
      <Layout gap="S" noPadding>
        <Layout gap="S">
          <div class="usages">
            <Layout noPadding>
              {#each staticUsage as usage}
                <div class="usage">
                  <Usage
                    {usage}
                    warnWhenFull={WARN_USAGE.includes(usage.name)}
                  />
                </div>
              {/each}
            </Layout>
          </div>
        </Layout>
        {#if monthlyUsage.length}
          <div class="monthly-container">
            <Layout gap="S">
              <Heading size="S" weight="light">Monthly</Heading>
              <div class="detail">
                <TooltipWrapper tooltip={new Date(quotaReset)}>
                  <Detail size="M">Resets in {daysRemainingInMonth} days</Detail
                  >
                </TooltipWrapper>
              </div>
              <div class="usages">
                <Layout noPadding>
                  {#each monthlyUsage as usage}
                    <div class="usage">
                      <Usage
                        {usage}
                        warnWhenFull={WARN_USAGE.includes(usage.name)}
                      />
                    </div>
                  {/each}
                </Layout>
              </div>
            </Layout>
          </div>
        {/if}
      </Layout>
    </DashCard>
  </Layout>
{/if}

<style>
  .usages {
    display: flex;
    flex-direction: column;
  }
  .detail :global(.spectrum-Detail) {
    color: var(--spectrum-global-color-gray-700);
  }
  .detail :global(.icon) {
    margin-bottom: 0;
  }
</style>
