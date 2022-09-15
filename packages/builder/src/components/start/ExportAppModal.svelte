<script>
  import { ModalContent, Toggle, Body } from "@budibase/bbui"

  export let app
  export let published
  let excludeRows = false

  $: title = published ? "Export published app" : "Export latest app"
  $: confirmText = published ? "Export published" : "Export latest"

  const exportApp = () => {
    const id = published ? app.prodId : app.devId
    const appName = encodeURIComponent(app.name)
    window.location = `/api/backups/export?appId=${id}&appname=${appName}&excludeRows=${excludeRows}`
  }
</script>

<ModalContent {title} {confirmText} onConfirm={exportApp}>
  <Body
    >Apps can be exported with or without data that is within internal tables -
    select this below.</Body
  >
  <Toggle text="Exclude Rows" bind:value={excludeRows} />
</ModalContent>
