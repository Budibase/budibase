<script>
  import { ModalContent, Toggle } from "@budibase/bbui"

  export let app
  let includeRows = true

  const exportApp = () => {
    const id = app.deployed ? app.prodId : app.devId
    const appName = encodeURIComponent(app.name)
    window.location = `/api/backups/export?appId=${id}&appname=${appName}&includeRows=${includeRows}`
  }
</script>

<ModalContent title={"Export"} confirmText={"Export"} onConfirm={exportApp}>
  <Toggle text="Include Data" bind:value={includeRows} />
</ModalContent>
