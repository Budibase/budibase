<script>
  import { backendUiStore } from "builderStore"

  export let value
</script>

<div class="block-field">
  <select class="budibase__input" bind:value>
    <option value="" />
    {#each $backendUiStore.models as model}
      <option value={model}>{model.name}</option>
    {/each}
  </select>
</div>
