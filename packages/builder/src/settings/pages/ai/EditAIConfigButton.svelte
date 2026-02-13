<script lang="ts">
  import {
    BUDIBASE_AI_PROVIDER_ID,
    type AIConfigResponse,
  } from "@budibase/types"
  import { ActionButton, Modal } from "@budibase/bbui"
  import CustomConfigModal from "./CustomConfigModal.svelte"
  import BBAIConfigModal from "./BBAIConfigModal.svelte"

  export let row: AIConfigResponse

  let configModal: { show: () => void; hide: () => void }
  let openModal: boolean

  $: configModal?.show()
</script>

<ActionButton
  size="S"
  on:click={() => {
    openModal = true
  }}>Edit</ActionButton
>

{#if openModal}
  <Modal
    bind:this={configModal}
    on:hide={() => {
      openModal = false
    }}
  >
    {#if row.provider !== BUDIBASE_AI_PROVIDER_ID}
      <CustomConfigModal
        config={row}
        provider={row.provider}
        type={row.configType}
      />
    {:else}
      <BBAIConfigModal config={row} type={row.configType} />
    {/if}
  </Modal>
{/if}
