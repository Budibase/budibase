<script>
  import { Label, Input, TextArea, Spacer } from "@budibase/bbui"
  import KeyValueBuilder from "components/integration/KeyValueBuilder.svelte"

  export let integration
</script>

<form>
  {#each Object.keys(integration) as configKey}
    <div class="form-row">
      {#if typeof integration[configKey] === 'object'}
        <Label small>{configKey}</Label>
        <KeyValueBuilder bind:object={integration[configKey]} />
      {:else}
        <Label small>{configKey}</Label>
        <Input
          outline
          type={integration[configKey].type}
          bind:value={integration[configKey]} />
      {/if}
    </div>
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
