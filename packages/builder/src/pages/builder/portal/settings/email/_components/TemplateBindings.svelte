<script>
  import { Body, Detail } from "@budibase/bbui"

  export let bindings
  export let onBindingClick = () => {}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="bindings">
  {#each bindings as binding}
    <div class="binding" on:click={() => onBindingClick(binding)}>
      <Detail size="M">{binding.name}</Detail>
      <Body size="XS">{binding.description}</Body>
    </div>
  {/each}
</div>

<style>
  .bindings {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-s);
    padding-right: var(--spacing-m);
    overflow-y: auto;
    max-height: 556px;
  }
  .binding {
    padding: var(--spacing-m);
    border-radius: 4px;
    background: var(--spectrum-global-color-gray-200);
    transition: background 130ms ease-out;
  }
  .binding:hover {
    cursor: pointer;
    background: var(--spectrum-global-color-gray-300);
  }
</style>
