<script>
  import {
    Body,
    Divider,
    Heading,
    Layout,
    notifications,
    Detail,
    Link,
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

  const warnUsage = ["Queries", "Automations", "Rows", "Day Passes"]

  $: quotaUsage = $licensing.quotaUsage
  $: license = $auth.user?.license
  $: accountPortalAccess = $auth?.user?.accountPortalAccess

  const setMonthlyUsage = () => {
    monthlyUsage = []
    if (quotaUsage.monthly) {
      for (let [key, value] of Object.entries(license.quotas.usage.monthly)) {
        const used = quotaUsage.monthly.current[key]
        if (used !== undefined) {
          monthlyUsage.push({
            name: value.name,
            used: used,
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
      const used = quotaUsage.usageQuota[key]
      if (used !== undefined) {
        staticUsage.push({
          name: value.name,
          used: used,
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
      textRows.push("Subscription has been cancelled")
      textRows.push(`${getDaysRemaining(cancelAt * 1000)} days remaining`)
    }
  }

  const setDaysRemainingInMonth = () => {
    let now = new Date()
    now = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const firstNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    const difference = firstNextMonth.getTime() - now.getTime()

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
      await licensing.getQuotaUsage()
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
  <Layout>
    <Layout noPadding gap="S">
      <Heading>Usage</Heading>
      <Body
        >Get information about your current usage within Budibase.
        {#if accountPortalAccess}
          To upgrade your plan and usage limits visit your <Link
            on:click={goToAccountPortal}
            size="L">Account</Link
          >
        {:else}
          To upgrade your plan and usage limits contact your account holder
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
                    warnWhenFull={warnUsage.includes(usage.name)}
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
                <Detail size="M">Resets in {daysRemainingInMonth} days</Detail>
              </div>
              <div class="usages">
                <Layout noPadding>
                  {#each monthlyUsage as usage}
                    <div class="usage">
                      <Usage
                        {usage}
                        warnWhenFull={warnUsage.includes(usage.name)}
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
    margin-bottom: 5px;
    margin-top: -8px;
  }
</style>
