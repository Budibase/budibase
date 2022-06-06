<script>
  import { ModalContent, Toggle } from "@budibase/bbui"

  export let app
  let excludeRows = false

  const exportApp = () => {
    const id = app.deployed ? app.prodId : app.devId
    const appName = encodeURIComponent(app.name)
    window.location = `/api/backups/export?appId=${id}&appname=${appName}&excludeRows=${excludeRows}`
  }
</script>

<ModalContent title={"Export"} confirmText={"Export"} onConfirm={exportApp}>
  <Toggle text="Exclude Rows" bind:value={excludeRows} />
</ModalContent>
