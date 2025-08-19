<script lang="ts">
  import { Modal, ModalContent, Body, Icon, Heading } from "@budibase/bbui"
  import { restTemplates } from "@/stores/builder"
  import RestTemplateOption from "./RestTemplateOption.svelte"
  import type { RestTemplate } from "@budibase/types"

  export let onSelect: (_template: RestTemplate) => void
  export let onCancel: () => void

  let modal: any

  export function show() {
    modal?.show()
  }

  export function hide() {
    modal?.hide()
  }

  const selectTemplate = (template: RestTemplate) => {
    onSelect(template)
    hide()
  }
</script>

<Modal bind:this={modal} on:hide={onCancel}>
  <ModalContent
    {onCancel}
    showCancelButton={true}
    cancelText="Cancel"
    showConfirmButton={false}
    size="XL"
  >
    <div class="modal-content">
      <div class="header">
        <Icon name="Globe" size="L" />
        <Heading size="M">Choose REST Template</Heading>
      </div>
      <Body size="S" color="grey">
        Select from popular REST API templates to quickly set up your datasource
      </Body>

      <div class="templates-grid">
        {#each $restTemplates.templates as template}
          <RestTemplateOption
            {template}
            on:click={() => selectTemplate(template)}
          />
        {/each}
      </div>
    </div>
  </ModalContent>
</Modal>

<style>
  .modal-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    padding: var(--spacing-s) 0;
  }

  .header {
    display: flex;
    align-items: center;
    gap: var(--spacing-l);
  }

  .templates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-xl);
    margin-top: var(--spacing-l);
    max-width: 100%;
  }

  @media (max-width: 768px) {
    .templates-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
