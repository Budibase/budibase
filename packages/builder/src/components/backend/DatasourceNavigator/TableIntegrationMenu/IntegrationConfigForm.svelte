<script>
  import { Label, Input, TextArea, Spacer } from "@budibase/bbui"
  import KeyValueBuilder from "components/integration/KeyValueBuilder.svelte"

  export let integration
  export let schema

  let unsaved = false
</script>

<form>
  {#each Object.keys(schema) as configKey}
    {#if schema[configKey].type === 'object'}
      <Label small>{configKey}</Label>
      <Spacer small />
      <KeyValueBuilder
        defaults={schema[configKey].default}
        bind:object={integration[configKey]} />
    {:else}
      <div class="form-row">
        <Label small>{configKey}</Label>
        <Input
          outline
          type={schema[configKey].type}
          on:change
          bind:value={integration[configKey]} />
      </div>
    {/if}
  {/each}
</form>

<style>
  .form-row {
    display: grid;
    grid-template-columns: 20% 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
    margin-bottom: var(--spacing-m);
  }
</style>
