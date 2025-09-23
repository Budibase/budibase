<script>
  import { Layout, Body, Heading, Toggle, notifications } from "@budibase/bbui"
  import { appStore } from "@/stores/builder"
  import { admin } from "@/stores/portal/admin"
  import { appsStore } from "@/stores/portal/apps"

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
</script>

<Layout noPadding>
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
