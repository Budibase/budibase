<script>
  import {
    Label,
    Input,
    Layout,
    Toggle,
    Button,
    TextArea,
  } from "@budibase/bbui"
  import KeyValueBuilder from "components/integration/KeyValueBuilder.svelte"
  import { capitalise } from "helpers"

  export let integration
  export let schema

  let addButton
</script>

<form>
  <Layout gap="S">
    {#each Object.keys(schema) as configKey}
      {#if schema[configKey].type === "object"}
        <div class="form-row ssl">
          <Label>{capitalise(configKey)}</Label>
          <Button secondary thin outline on:click={addButton.addEntry()}
            >Add</Button
          >
        </div>
        <KeyValueBuilder
          bind:this={addButton}
          defaults={schema[configKey].default}
          bind:object={integration[configKey]}
          noAddButton={true}
        />
      {:else if schema[configKey].type === "boolean"}
        <div class="form-row">
          <Label>{capitalise(configKey)}</Label>
          <Toggle text="" bind:value={integration[configKey]} />
        </div>
      {:else if schema[configKey].type === "longForm"}
        <div class="form-row">
          <Label>{capitalise(configKey)}</Label>
          <TextArea
            type={schema[configKey].type}
            on:change
            bind:value={integration[configKey]}
          />
        </div>
      {:else}
        <div class="form-row">
          <Label>{capitalise(configKey)}</Label>
          <Input
            type={schema[configKey].type}
            on:change
            bind:value={integration[configKey]}
          />
        </div>
      {/if}
    {/each}
  </Layout>
</form>

<style>
  .form-row {
    display: grid;
    grid-template-columns: 20% 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }

  .form-row.ssl {
    display: grid;
    grid-template-columns: 20% 20%;
    grid-gap: var(--spacing-l);
    align-items: center;
  }
</style>
