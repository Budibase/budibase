<script>
  import { Select, ModalContent } from "@budibase/bbui"
  import download from "downloadjs"
  import { _ as t } from "svelte-i18n"

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
    const filename = $t("export-0") + ` ${exportFormat}`
    download(
      `/api/views/export?view=${encodeURIComponent(
        view
      )}&format=${exportFormat}`,
      filename
    )
  }
</script>

<ModalContent
  title={$t("export-data")}
  confirmText={$t("export")}
  onConfirm={exportView}
>
  <Select
    label={$t("format")}
    bind:value={exportFormat}
    options={FORMATS}
    placeholder={null}
    getOptionLabel={x => x.name}
    getOptionValue={x => x.key}
  />
</ModalContent>
