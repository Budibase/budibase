<script>
  import { _ } from "../../../lang/i18n"
  import { ModalContent, Toggle, Body, InlineAlert } from "@budibase/bbui"

  export let app
  export let published
  let excludeRows = false

  $: title = published
    ? $_("components.start.ExportAppModal.Export_published_app")
    : $_("components.start.ExportAppModal.Export_latest_app")
  $: confirmText = published
    ? $_("components.start.ExportAppModal.Export_published")
    : $_("components.start.ExportAppModal.Export_latest")

  const exportApp = () => {
    const id = published ? app.prodId : app.devId
    const appName = encodeURIComponent(app.name)
    window.location = `/api/backups/export?appId=${id}&appname=${appName}&excludeRows=${excludeRows}`
  }
</script>

<ModalContent {title} {confirmText} onConfirm={exportApp}>
  <InlineAlert header={$_("components.start.ExportAppModal.Do_not_share")} />
  <Body>{$_("components.start.ExportAppModal.App_can_be")}.</Body>
  <Toggle text="Exclude Rows" bind:value={excludeRows} />
</ModalContent>
