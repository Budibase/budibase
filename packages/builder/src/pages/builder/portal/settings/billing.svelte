<script>
  import {
    Body,
    Divider,
    Heading,
    Layout,
    notifications,
    Page,
  } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { auth, licensing } from "stores/portal"
  import Usage from "components/billing/Usage.svelte"

  let staticUsage = []
  let monthlyUsage = []
  let loaded = false

  $: quotaUsage = $licensing.quotaUsage
  $: license = $auth.user?.license

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
  }

  const capitalise = string => {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
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
    if (license && quotaUsage) {
      setMonthlyUsage()
      setStaticUsage()
    }
  }
</script>

<Page maxWidth={"100ch"}>
  {#if loaded}
    <Layout>
      <Heading>Billing</Heading>
      <Body>Get information about your current usage and manage your plan</Body>
    </Layout>
    <Layout gap="S">
      <Divider />
    </Layout>
    <Layout gap="S" noPadding>
      <Layout gap="XS">
        <Body size="S">Your plan</Body>
        <Heading size="S">{capitalise(license?.plan.type)}</Heading>
      </Layout>
      <Layout gap="S">
        <Body size="S">Usage</Body>
        <div class="usages">
          {#each staticUsage as usage}
            <div class="usage">
              <Usage {usage} />
            </div>
          {/each}
        </div>
      </Layout>
      {#if monthlyUsage.length}
        <Layout gap="S">
          <Body size="S">Monthly</Body>
          <div class="usages">
            {#each monthlyUsage as usage}
              <div class="usage">
                <Usage {usage} />
              </div>
            {/each}
          </div>
        </Layout>
        <div />
      {/if}
    </Layout>
  {/if}
</Page>

<style>
  .usages {
    display: grid;
    column-gap: 60px;
    row-gap: 50px;
    grid-template-columns: 1fr 1fr 1fr;
  }
</style>
