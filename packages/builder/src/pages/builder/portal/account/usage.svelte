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
  import { admin, auth, licensing } from "stores/portal"
  import { Constants } from "@budibase/frontend-core"
  import { DashCard, Usage } from "components/usage"

  import { _ } from "../../../../../lang/i18n"

  let staticUsage = []
  let monthlyUsage = []
  let cancelAt
  let loaded = false
  let textRows = []
  let daysRemainingInMonth
  let primaryActionText

  const upgradeUrl = `${$admin.accountPortalUrl}/portal/upgrade`
  const manageUrl = `${$admin.accountPortalUrl}/portal/billing`

  const WARN_USAGE = [
    $_("pages.builder.portal.account.usage.Queries"),
    $_("pages.builder.portal.account.usage.Automations"),
    $_("pages.builder.portal.account.usage.Rows"),
    $_("pages.builder.portal.account.usage.Day_Passes"),
  ]
  const EXCLUDE_QUOTAS = [$_("pages.builder.portal.account.usage.Queries")]

  $: quotaUsage = $licensing.quotaUsage
  $: license = $auth.user?.license
  $: accountPortalAccess = $auth?.user?.accountPortalAccess
  $: quotaReset = quotaUsage?.quotaReset
  $: canManagePlan =
    ($admin.cloud && accountPortalAccess) || (!$admin.cloud && $auth.isAdmin)

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
      textRows.push({
        message: $_(
          "pages.builder.portal.account.usage.Subscription_has_been_cancelled"
        ),
      })
      textRows.push({
        message: `${getDaysRemaining(cancelAt * 1000)} ${$_(
          "pages.builder.portal.account.usage.days_remaining"
        )}`,
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
    if (license?.plan.type === Constants.PlanType.FREE) {
      window.location.href = upgradeUrl
    } else {
      window.location.href = manageUrl
    }
  }

  const setPrimaryActionText = () => {
    if (license?.plan.type === Constants.PlanType.FREE) {
      primaryActionText = $_("pages.builder.portal.account.usage.Upgrade")
      return
    }

    if (cancelAt) {
      primaryActionText = $_("pages.builder.portal.account.usage.Renew")
    } else {
      primaryActionText = $_("pages.builder.portal.account.usage.Manage")
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
      <Heading>{$_("pages.builder.portal.account.usage.Usage")}</Heading>
      <Body>
        <div>{$_("pages.builder.portal.account.usage.Get_information")}</div>
      </Body>
    </Layout>
    <Divider />
    {#if canManagePlan}
      <Body>
        {$_("pages.builder.portal.account.usage.To_upgrade")}
        <Link size="L" on:click={goToAccountPortal}
          >{$_("pages.builder.portal.account.usage.account")}</Link
        >.
      </Body>
    {:else}
      <Body
        >{$_("pages.builder.portal.account.usage.Contact_your_account")}</Body
      >
    {/if}

    <DashCard
      description={$_("pages.builder.portal.account.usage.YOUR_PLAN")}
      title={planTitle()}
      {primaryActionText}
      primaryAction={accountPortalAccess ? goToAccountPortal : undefined}
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
          </Layout>
        </div>

        {#if monthlyUsage.length}
          <div class="column">
            <Layout noPadding gap="M">
              <Layout gap="XS" noPadding>
                <Heading size="S"
                  >{$_(
                    "pages.builder.portal.account.usage.Monthly_limits"
                  )}</Heading
                >
                <div class="detail">
                  <TooltipWrapper tooltip={new Date(quotaReset)}>
                    <Detail size="M">
                      {$_("pages.builder.portal.account.usage.Resets_in")}
                      {daysRemainingInMonth}
                      {$_("pages.builder.portal.account.usage.days")}
                    </Detail>
                  </TooltipWrapper>
                </div>
              </Layout>
              <Layout noPadding gap="M">
                {#each monthlyUsage as usage}
                  <Usage
                    {usage}
                    warnWhenFull={WARN_USAGE.includes(usage.name)}
                  />
                {/each}
              </Layout>
            </Layout>
          </div>
        {/if}
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
