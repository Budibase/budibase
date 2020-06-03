<script>
  import { backendUiStore } from "builderStore"

  export let value
</script>

<div class="uk-margin block-field">
  <div class="uk-form-controls">
    <select class="budibase__input" on:change {value}>
      <option value="" />
      {#each $backendUiStore.models as model}
        <option value={model._id}>{model.name}</option>
      {/each}
    </select>
  </div>
</div>
