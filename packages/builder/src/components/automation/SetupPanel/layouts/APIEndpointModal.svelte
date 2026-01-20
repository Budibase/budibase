<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { Modal } from "@budibase/bbui"
  import APIEndpointViewer from "@/components/integration/APIEndpointViewer.svelte"

  export let datasourceId: string | undefined
  export let zIndex = 900

  const dispatch = createEventDispatcher()

  let modal: Modal
  let modalBody: HTMLDivElement | undefined

  const handleSave = (event: CustomEvent<{ queryId?: string }>) => {
    modal?.hide()
    dispatch("save", event.detail)
  }

  $: if (datasourceId && modal) {
    modal.show()
  }
  $: if (!datasourceId && modal) {
    modal.hide()
  }
</script>

<Modal
  bind:this={modal}
  {zIndex}
  on:hide={() => {
    dispatch("close")
  }}
>
  <div
    bind:this={modalBody}
    class="spectrum-Dialog--large api-endpoint-modal"
    role="dialog"
    tabindex="-1"
    aria-modal="true"
  >
    {#if datasourceId}
      <APIEndpointViewer
        {datasourceId}
        redirectOnSave={false}
        embedded
        on:save={handleSave}
      />
    {/if}
  </div>
</Modal>

<style>
  .api-endpoint-modal {
    width: 98vw;
    height: 86vh;
    max-width: 1900px;
    max-height: 90vh;
    min-height: 620px;
    display: flex;
    flex-direction: column;
    padding: 16px 20px 0;
    box-sizing: border-box;
    overflow: hidden;
  }

  .api-endpoint-modal :global(.api-endpoint-viewer) {
    flex: 1;
    min-height: 0;
  }
</style>
