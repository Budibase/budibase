<script>
  import { Select, ModalContent, notifications } from "@budibase/bbui"
  import download from "downloadjs"
  import { get } from "builderStore/api"

  const FORMATS = [
    {
      name: "CSV",
      key: "csv",
    },
    {
      name: "JSON",
      key: "json",
    },
  ]

  export let view

  let exportFormat = FORMATS[0].key

  async function exportView() {
    const uri = encodeURIComponent(view)
    const response = await get(
      `/api/views/export?view=${uri}&format=${exportFormat}`
    )
    if (response.status === 200) {
      const data = await response.text()
      download(data, `export.${exportFormat}`)
    } else {
      notifications.error(
        `Unable to export ${exportFormat.toUpperCase()} data.`
      )
    }
  }
</script>

<ModalContent title="Export Data" confirmText="Export" onConfirm={exportView}>
  <Select
    label="Format"
    bind:value={exportFormat}
    options={FORMATS}
    placeholder={null}
    getOptionLabel={x => x.name}
    getOptionValue={x => x.key}
  />
</ModalContent>
