<script>
  import { hostingStore } from "builderStore"
  import { HostingTypes } from "constants/backend"
  import {
    Heading,
    Divider,
    notifications,
    Input,
    ModalContent,
    Toggle,
    Body,
  } from "@budibase/bbui"
  import ThemeEditor from "components/settings/ThemeEditor.svelte"
  import analytics from "analytics"
  import { onMount } from "svelte"

  let hostingInfo
  let selfhosted = false

  $: analyticsDisabled = analytics.disabled()

  async function save() {
    hostingInfo.type = selfhosted ? HostingTypes.SELF : HostingTypes.CLOUD
    if (!selfhosted && hostingInfo._rev) {
      hostingInfo = {
        type: hostingInfo.type,
        _id: hostingInfo._id,
        _rev: hostingInfo._rev,
      }
    }
    try {
      await hostingStore.actions.save(hostingInfo)
      notifications.success(`Settings saved.`)
    } catch (err) {
      notifications.error(`Failed to update builder settings.`)
    }
  }

  function updateSelfHosting(event) {
    if (hostingInfo.type === HostingTypes.CLOUD && event.detail) {
      hostingInfo.hostingUrl = "localhost:10000"
      hostingInfo.useHttps = false
      hostingInfo.selfHostKey = "budibase"
    }
  }

  function toggleAnalytics() {
    if (analyticsDisabled) {
      analytics.optIn()
    } else {
      analytics.optOut()
    }
  }

  onMount(async () => {
    hostingInfo = await hostingStore.actions.fetch()
    selfhosted = hostingInfo.type === "self"
  })
</script>

<ModalContent title="Builder settings" confirmText="Save" onConfirm={save}>
  <Heading xs>Theme</Heading>
  <ThemeEditor />
  <Divider noMargin noGrid />
  <Heading xs>Hosting</Heading>
  <Body size="S">
    This section contains settings that relate to the deployment and hosting of
    apps made in this builder.
  </Body>
  <Toggle
    text="Self hosted"
    on:change={updateSelfHosting}
    bind:value={selfhosted}
  />
  {#if selfhosted}
    <Input bind:value={hostingInfo.hostingUrl} label="Hosting URL" />
    <Input bind:value={hostingInfo.selfHostKey} label="Hosting Key" />
    <Toggle text="HTTPS" bind:value={hostingInfo.useHttps} />
  {/if}
  <Divider noMargin noGrid />
  <Heading xs>Analytics</Heading>
  <Body size="S">
    If you would like to send analytics that help us make budibase better,
    please let us know below.
  </Body>
  <Toggle
    text="Send Analytics To Budibase"
    value={!analyticsDisabled}
    on:change={toggleAnalytics}
  />
</ModalContent>
