<script>
  import { Label, Input, TextArea, Spacer } from "@budibase/bbui"
  import KeyValueBuilder from "components/integration/KeyValueBuilder.svelte"

  export let integration
</script>

<form>
  {#each Object.keys(integration) as configKey}
    {#if typeof integration[configKey] === 'object'}
      <Label small>{configKey}</Label>
      <Spacer small />
      <KeyValueBuilder bind:object={integration[configKey]} />
    {:else}
      <div class="form-row">
        <Label small>{configKey}</Label>
        <Input
          outline
          type={integration[configKey].type}
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
