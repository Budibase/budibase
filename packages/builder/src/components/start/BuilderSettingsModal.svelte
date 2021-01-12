<script>
  import { notifier } from "builderStore/store/notifications"
  import { hostingStore } from "builderStore"
  import { Input, ModalContent, Toggle } from "@budibase/bbui"
  import ThemeEditor from "components/settings/ThemeEditor.svelte"
  import analytics from "analytics"
  import { onMount } from "svelte"

  let hostingInfo
  let selfhosted = false

  async function save() {
    hostingInfo.type = selfhosted ? "self" : "cloud"
    if (!selfhosted && hostingInfo._rev) {
      hostingInfo = {
        type: hostingInfo.type,
        _id: hostingInfo._id,
        _rev: hostingInfo._rev,
      }
    }
    try {
      await hostingStore.actions.save(hostingInfo)
      notifier.success(`Settings saved.`)
    } catch (err) {
      notifier.danger(`Failed to update builder settings.`)
    }
  }

  function updateSelfHosting(event) {
    if (hostingInfo.type === "cloud" && event.target.checked) {
      hostingInfo.hostingUrl = "localhost:10000"
      hostingInfo.useHttps = false
      hostingInfo.selfHostKey = "budibase"
    }
  }

  onMount(async () => {
    hostingInfo = await hostingStore.actions.fetch()
    selfhosted = hostingInfo.type === "self"
  })
</script>

<ModalContent title="Builder settings" confirmText="Save" onConfirm={save}>
  <h5>Theme</h5>
  <ThemeEditor />
  <h5>Hosting</h5>
  <p>
    This section contains settings that relate to the deployment and hosting of
    apps made in this builder.
  </p>
  <Toggle
    thin
    text="Self hosted"
    on:change={updateSelfHosting}
    bind:checked={selfhosted} />
  {#if selfhosted}
    <Input bind:value={hostingInfo.hostingUrl} label="Hosting URL" />
    <Input bind:value={hostingInfo.selfHostKey} label="Hosting Key" />
    <Toggle thin text="HTTPS" bind:checked={hostingInfo.useHttps} />
  {/if}
</ModalContent>

<style>
  h5 {
    margin: 0;
    font-size: 14px;
  }
  p {
    margin: 0;
    font-size: 12px;
  }
</style>
