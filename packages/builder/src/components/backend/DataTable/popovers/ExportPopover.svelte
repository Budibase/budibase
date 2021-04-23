<script>
  import { Button, Select, Heading } from "@budibase/bbui"
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
  export let onClosed

  let exportFormat = FORMATS[0].key

  async function exportView() {
    download(
      `/api/views/export?view=${encodeURIComponent(
        view.name
      )}&format=${exportFormat}`
    )
    onClosed()
  }
</script>

<div class="popover">
  <Heading s>Export Data</Heading>
  <Select
    label="Format"
    bind:value={exportFormat}
    options={FORMATS}
    getOptionLabel={x => x.name}
    getOptionValue={x => x.key} />
  <div class="footer">
    <Button secondary on:click={onClosed}>Cancel</Button>
    <Button cta on:click={exportView}>Export</Button>
  </div>
</div>

<style>
  .popover {
    display: grid;
    grid-gap: var(--spacing-xl);
    padding: var(--spacing-xl);
    width: 240px;
  }

  h5 {
    margin: 0;
    font-weight: 500;
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-m);
  }
</style>
