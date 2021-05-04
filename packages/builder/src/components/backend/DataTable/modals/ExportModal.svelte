<script>
  import { Select, ModalContent } from "@budibase/bbui"
  import download from "downloadjs"

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
    download(
      `/api/views/export?view=${encodeURIComponent(
        view.name
      )}&format=${exportFormat}`
    )
  }
</script>

<ModalContent title="Export Data" confirmText="Export" onConfirm={exportView}>
  <Select
    label="Format"
    bind:value={exportFormat}
    options={FORMATS}
    placeholder={null}
<<<<<<< HEAD
    getOptionLabel={(x) => x.name}
    getOptionValue={(x) => x.key}
=======
    getOptionLabel={x => x.name}
    getOptionValue={x => x.key}
>>>>>>> 900637c221e4034babd21d69dcaa71b360a2adb2
  />
</ModalContent>
