<script>
  import { notifier } from "builderStore/store/notifications"
  import { hostingStore } from "builderStore"
  import { Input, ModalContent, Toggle } from "@budibase/bbui"
  import analytics from "analytics"
  import { onMount } from "svelte"

  let selfhosted = false
  let hostingInfo

  async function save() {
    if (!selfhosted) {
      return
    }
    hostingInfo.type = selfhosted ? "self" : "cloud"
    try {
      await hostingStore.actions.save(hostingInfo)
      notifier.success(`Settings saved.`)
    } catch (err) {
      notifier.danger(`Failed to update builder settings.`)
    }
  }

  onMount(async () => {
    hostingInfo = await hostingStore.actions.fetch()
    selfhosted = hostingInfo.type === "self"
  })
</script>

<ModalContent
  title="Builder settings"
  confirmText="Save"
  onConfirm={save}
  showConfirmButton={selfhosted}>
  <h5>Hosting</h5>
  <p>
    This section contains settings that relate to the deployment and hosting of
    apps made in this builder.
  </p>
  <Toggle thin text="Self hosted" bind:checked={selfhosted} />
  {#if selfhosted}
    <Input bind:value={hostingInfo.appUrl} label="Apps URL" />
    <Input bind:value={hostingInfo.workerUrl} label="Workers URL" />
    <Input bind:value={hostingInfo.minioUrl} label="MINIO URL" />
    <Input bind:value={hostingInfo.couchUrl} label="CouchDB URL" />
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
