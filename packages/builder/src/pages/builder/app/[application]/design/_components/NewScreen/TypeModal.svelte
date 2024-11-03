<script>
  import { ModalContent, Layout, Body } from "@budibase/bbui"

  let selectedType = null

  export let title
  export let types
  export let onCancel = () => {}
  export let onConfirm = () => {}
  export let showCancelButton = true
</script>

<ModalContent
  {title}
  confirmText="Done"
  cancelText="Back"
  onConfirm={() => onConfirm(selectedType)}
  {onCancel}
  disabled={!selectedType}
  size="L"
  {showCancelButton}
>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <Layout noPadding gap="S">
    {#each types as type}
      <div
        class="type"
        class:selected={selectedType === type.id}
        on:click={() => (selectedType = type.id)}
      >
        <div class="image">
          <img alt={type.img.alt} src={type.img.src} />
        </div>
        <div class="typeContent">
          <Body noPadding>{type.title}</Body>
          <Body size="S">{type.description}</Body>
        </div>
      </div>
    {/each}
  </Layout>
</ModalContent>

<style>
  .type {
    cursor: pointer;
    gap: var(--spacing-s);
    background: var(--spectrum-alias-background-color-secondary);
    transition: 0.3s all;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 4px;
    display: flex;
    overflow: hidden;
  }

  .type:hover {
    border: 1px solid var(--grey-5);
  }

  .type.selected {
    border: 1px solid var(--blue);
  }
  .type :global(p:nth-child(2)) {
    color: var(--grey-6);
  }
  .typeContent {
    box-sizing: border-box;
    padding: var(--spacing-m) var(--spacing-xl);
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .image {
    min-width: 133px;
    height: 73px;
    background-color: var(--grey-2);
  }

  .image img {
    height: 100%;
  }
</style>
