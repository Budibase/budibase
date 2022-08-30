<script>
  import {
    Body,
    Divider,
    Heading,
    Layout,
    notifications,
    Page,
    Detail,
  } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { admin, auth, licensing } from "../../../../stores/portal"
  import { PlanType } from "../../../../constants"
  import { DashCard, Usage } from "../../../../components/usage"

  let staticUsage = []
  let monthlyUsage = []
  let price
  let lastPayment
  let cancelAt
  let nextPayment
  let balance
  let loaded = false
  let textRows = []
  let daysRemainingInMonth

  const upgradeUrl = `${$admin.accountPortalUrl}/portal/upgrade`
  const manageUrl = `${$admin.accountPortalUrl}/portal/billing`

  const warnUsage = ["Queries", "Automations", "Rows"]

  $: quotaUsage = $licensing.quotaUsage
  $: license = $auth.user?.license

  const numberFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

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

  const setNextPayment = () => {
    const periodEnd = license?.billing.subscription?.currentPeriodEnd
    const cancelAt = license?.billing.subscription?.cancelAt
    if (periodEnd) {
      if (cancelAt && periodEnd <= cancelAt) {
        return
      }
      nextPayment = `Next payment: ${getLocaleDataString(periodEnd)}`
    }
  }

  const setCancelAt = () => {
    cancelAt = license?.billing.subscription?.cancelAt
  }

  const setLastPayment = () => {
    const periodStart = license?.billing.subscription?.currentPeriodStart
    if (periodStart) {
      lastPayment = `Last payment: ${getLocaleDataString(periodStart)}`
    }
  }

  const setBalance = () => {
    const customerBalance = license?.billing.customer.balance
    if (customerBalance) {
      balance = `Balance: ${numberFormatter.format(
        (customerBalance / 100) * -1
      )}`
    }
  }

  const getLocaleDataString = epoch => {
    const date = new Date(epoch * 1000)
    return date.toLocaleDateString("default", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const setPrice = () => {
    const planPrice = license.plan.price
    price = `${numberFormatter.format(planPrice.amountMonthly / 100)} per month`
  }

  const capitalise = string => {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  }

  const planTitle = () => {
    return capitalise(license?.plan.type)
  }

  const planSubtitle = () => {
    return `${license?.plan.price.sessions} day passes`
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
    } else {
      if (price) {
        textRows.push(price)
      }
      if (lastPayment) {
        textRows.push(lastPayment)
      }
      if (nextPayment) {
        textRows.push(nextPayment)
      }
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
      setPrice()
      setBalance()
      setLastPayment()
      setNextPayment()
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

<Page maxWidth={"100ch"}>
  {#if loaded}
    <Layout>
      <Layout noPadding gap="S">
        <Heading>Billing</Heading>
        <Body
          >Get information about your current usage and manage your plan</Body
        >
      </Layout>
      <Divider />
      <DashCard
        description="YOUR CURRENT PLAN"
        title={planTitle()}
        subtitle={planSubtitle()}
        primaryActionText={cancelAt ? "Upgrade" : "Manage"}
        primaryAction={goToAccountPortal}
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
                  <Detail size="M">Resets in {daysRemainingInMonth} days</Detail
                  >
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
</Page>

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
  /*.monthly-container {*/
  /*  margin-top: -35px;*/
  /*}*/
  .card-container {
    margin-top: 25px;
  }
</style>
