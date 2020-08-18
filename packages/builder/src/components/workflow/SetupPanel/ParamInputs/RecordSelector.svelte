<script>
  import { backendUiStore } from "builderStore"
  import { Input } from "@budibase/bbui"

  export let value
</script>

<div class="uk-margin block-field">
  <div class="uk-form-controls">
    <select class="budibase__input" bind:value={value.model}>
      {#each $backendUiStore.models as model}
        <option value={model}>{model.name}</option>
      {/each}
    </select>
  </div>
</div>

{#if value.model}
  <div class="uk-margin block-field">
    <label class="uk-form-label fields">Fields</label>
    {#each Object.keys(value.model.schema) as field}
      <div class="uk-form-controls uk-margin">
        <Input bind:value={value[field]} label={field} />
      </div>
    {/each}
  </div>
{/if}

<style>
  .fields {
    font-weight: 500;
  }
</style>
