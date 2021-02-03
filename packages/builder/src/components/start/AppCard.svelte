<script>
  import { TextButton } from "@budibase/bbui"
  import { Heading } from "@budibase/bbui"
  import { Spacer } from "@budibase/bbui"
  import api from "builderStore/api"
  import { notifier } from "builderStore/store/notifications"
  import Spinner from "components/common/Spinner.svelte"
  import download from "downloadjs"

  export let name, _id

  let appExportLoading = false

  async function exportApp() {
    appExportLoading = true
    try {
      download(`/api/backups/export?appId=${_id}&appname=${name}`)
      notifier.success("App Export Complete.")
    } catch (err) {
      console.error(err)
      notifier.danger("App Export Failed.")
    } finally {
      appExportLoading = false
    }
  }
</script>

<div class="apps-card">
  <Heading small black>{name}</Heading>
  <Spacer medium />
  <div class="card-footer">
    <TextButton text medium blue href="/_builder/{_id}">
      Open {name} →
    </TextButton>
    {#if appExportLoading}
      <Spinner size="10" />
    {:else}
      <i class="ri-folder-download-line" on:click={exportApp} />
    {/if}
  </div>
</div>

<style>
  .apps-card {
    background-color: var(--background);
    padding: var(--spacing-xl) var(--spacing-xl) var(--spacing-xl)
      var(--spacing-xl);
    max-width: 300px;
    max-height: 150px;
    border-radius: var(--border-radius-m);
    border: var(--border-dark);
  }

  .card-footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  i {
    font-size: var(--font-size-l);
    cursor: pointer;
    transition: 0.2s all;
  }

  i:hover {
    color: var(--blue);
  }
</style>
