<script>
  import api from "builderStore/api"
  import { Button, Select } from "@budibase/bbui"
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
    const response = await api.post(
      `/api/views/export?format=${exportFormat}`,
      view
    )
    const downloadInfo = await response.json()
    onClosed()
    window.location = downloadInfo.url
  }
</script>

<div class="popover">
  <h5>Export Data</h5>
  <Select label="Format" secondary thin bind:value={exportFormat}>
    {#each FORMATS as format}
      <option value={format.key}>{format.name}</option>
    {/each}
  </Select>
  <div class="footer">
    <Button secondary on:click={onClosed}>Cancel</Button>
    <Button primary on:click={exportView}>Export</Button>
  </div>
</div>

<style>
  .popover {
    display: grid;
    grid-gap: var(--spacing-xl);
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
