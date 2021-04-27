<script>
  import { goto } from "@roxi/routify"
  import { ActionButton, Heading, Spacer, Icon } from "@budibase/bbui"
  import { notifications } from "@budibase/bbui"
  import Spinner from "components/common/Spinner.svelte"
  import download from "downloadjs"

  export let name, _id

  let appExportLoading = false

  async function exportApp() {
    appExportLoading = true
    try {
      download(
        `/api/backups/export?appId=${_id}&appname=${encodeURIComponent(name)}`
      )
      notifications.success("App Export Complete.")
    } catch (err) {
      console.error(err)
      notifications.error("App Export Failed.")
    } finally {
      appExportLoading = false
    }
  }
</script>

<div class="apps-card">
  <Heading s>{name}</Heading>
  <Spacer medium />
  <div class="card-footer" data-cy={`app-${name}`}>
    <ActionButton text medium blue on:click={() => $goto(`/builder/${_id}`)}>
      Open
      {name}
      →
    </ActionButton>
    {#if appExportLoading}
      <Spinner size="10" />
    {:else}
      <ActionButton icon="Download" quiet />
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
