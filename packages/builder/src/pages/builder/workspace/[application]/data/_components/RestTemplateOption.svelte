<script lang="ts">
  import { Body } from "@budibase/bbui"
  import { type RestTemplate } from "@budibase/types"

  export let template: RestTemplate
  export let disabled = false
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click class:disabled class="option">
  <div class="header">
    <div class="icon">
      <img src={template.icon} alt={template.name} />
    </div>
    <Body>{template.name}</Body>
  </div>
  <div class="description">
    <Body size="XS">{template.description}</Body>
  </div>
</div>

<style>
  .option {
    background-color: var(--background);
    border: 1px solid var(--grey-4);
    padding: 16px;
    border-radius: 4px;
    cursor: pointer;
    min-height: 100px;
    display: flex;
    flex-direction: column;
  }

  .option :global(label) {
    cursor: pointer;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    line-height: 1.4;
  }

  .option :global(p) {
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    line-height: 1.4;
    margin: 0;
  }

  .option:hover {
    background-color: var(--background-alt);
  }

  .header {
    display: flex;
    margin-bottom: 12px;
    align-items: center;
    flex-shrink: 0;
  }

  .icon {
    display: flex;
    margin-right: 8px;
    flex-shrink: 0;
    width: 32px;
    height: 32px;
  }

  .icon img {
    width: 100%;
    height: 100%;
  }

  .disabled {
    opacity: 0.5;
    pointer-events: none;
  }
</style>
