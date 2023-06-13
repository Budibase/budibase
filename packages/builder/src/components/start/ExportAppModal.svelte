<script>
  import {
    ModalContent,
    Toggle,
    Body,
    InlineAlert,
    Divider,
  } from "@budibase/bbui"

  export let app
  export let published
  let includeInternalTablesRows = true
  let encypt = true

  $: title = published ? "Export published app" : "Export latest app"
  $: confirmText = published ? "Export published" : "Export latest"

  const exportApp = () => {
    const id = published ? app.prodId : app.devId
    const appName = encodeURIComponent(app.name)
    window.location = `/api/backups/export?appId=${id}&appname=${appName}&excludeRows=${!includeInternalTablesRows}`
  }
</script>

<ModalContent {title} {confirmText} onConfirm={exportApp}>
  <Body>
    <Toggle
      text="Export rows from internal tables"
      bind:value={includeInternalTablesRows}
    />
    <Toggle text="Encrypt my export" bind:value={encypt} />
  </Body>
  {#if !encypt}
    <InlineAlert
      header="Do not share your budibase application exports publicly as they may contain sensitive information such as database credentials or secret keys."
    />
  {/if}
</ModalContent>
