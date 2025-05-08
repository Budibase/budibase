<script lang="ts">
  import { ModalContent, Layout, Body } from "@budibase/bbui"

  type SelectableType = {
    id: string
    title: string
    description: string
    img: {
      src: string
      alt: string
    }
  }

  export let title: string
  export let types: SelectableType[]
  export let onConfirm: (_selectedType: string) => Promise<void>
  export let onCancel: () => void
  export let showCancelButton: boolean = true

  let selectedType: string | null = null

  function confirm() {
    onConfirm(selectedType!)
  }
</script>

<ModalContent
  {title}
  confirmText="Done"
  cancelText="Back"
  onConfirm={confirm}
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
          <Body>{type.title}</Body>
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
