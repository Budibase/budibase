<script>
  import {
    Layout,
    Body,
    Heading,
    Divider,
    Toggle,
    notifications,
  } from "@budibase/bbui"
  import { appStore } from "@/stores/builder"
  import { onMount } from "svelte"
  import { admin, appsStore } from "@/stores/portal"

  $: app = $appsStore.apps.find(app => $appStore.appId?.includes(app.appId))
  $: isCloud = $admin.cloud
  $: chainAutomations = app?.automations?.chainAutomations ?? !isCloud

  async function save({ detail }) {
    try {
      await appsStore.save($appStore.appId, {
        automations: {
          chainAutomations: detail,
        },
      })
    } catch (error) {
      notifications.error("Error updating automation chaining setting")
    }
  }

  onMount(async () => {
    // Component initialization if needed
  })
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading>Automations</Heading>
    <Body>Configure automation settings</Body>
  </Layout>
  <Divider />

  <Layout gap="XS" noPadding>
    <Heading size="XS">Chain automations</Heading>
    <Body size="S">Allow automations to trigger from other automations</Body>
    <div class="setting-spacing">
      <Toggle
        text={"Enable chaining"}
        on:change={e => {
          save(e)
        }}
        value={chainAutomations}
      />
    </div>
  </Layout>
</Layout>

<style>
  .setting-spacing {
    padding-top: var(--spacing-s);
  }
</style>
