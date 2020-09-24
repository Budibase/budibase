<script>
  import {
    TextButton,
    Button,
    Icon,
    Input,
    Select,
    Popover,
  } from "@budibase/bbui"
  import { backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import api from "builderStore/api"

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

  let anchor
  let dropdown
  let exportFormat

  async function exportView() {
    const response = await api.post(
      `/api/views/export?format=${exportFormat}`,
      view
    )
    const downloadInfo = await response.json()
    window.location = downloadInfo.url
  }
</script>

<div bind:this={anchor}>
  <TextButton text small on:click={dropdown.show}>
    <Icon name="download" />
    Export
  </TextButton>
</div>
<Popover bind:this={dropdown} {anchor} align="left">
  <h5>Export Format</h5>
  <Select secondary thin bind:value={exportFormat}>
    {#each FORMATS as format}
      <option value={format.key}>{format.name}</option>
    {/each}
  </Select>
  <div class="button-group">
    <Button secondary on:click={dropdown.hide}>Cancel</Button>
    <Button primary on:click={exportView}>Export</Button>
  </div>
</Popover>

<style>
  h5 {
    margin-top: 0;
  }

  .button-group {
    margin-top: var(--spacing-l);
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-s);
  }
</style>
