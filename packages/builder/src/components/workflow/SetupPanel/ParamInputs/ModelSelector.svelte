<script>
  import { backendUiStore } from "builderStore"

  export let value
</script>

<div class="uk-margin block-field">
  <div class="uk-form-controls">
    <select class="budibase__input" bind:value>
      <option value=""></option>
      {#each $backendUiStore.models as model}
        <option value={model}>{model.name}</option>
      {/each}
    </select>
  </div>
</div>
