<script>
  import { backendUiStore } from "builderStore"
  import { Input } from "@budibase/bbui"

  export let value
</script>

<div class="bb-margin-xl block-field">
  <select class="budibase__input" bind:value={value.model}>
    {#each $backendUiStore.models as model}
      <option value={model}>{model.name}</option>
    {/each}
  </select>
</div>

{#if value.model}
  <div class="bb-margin-xl block-field">
    <label class="uk-form-label fields">Fields</label>
    {#each Object.keys(value.model.schema) as field}
      <div class="bb-margin-xl">
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
