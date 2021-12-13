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
  import { IntegrationTypes } from "constants/backend"

  export let datasource
  export let schema
  export let creating

  function filter([key, value]) {
    if (!value) {
      return false
    }
    return !(
      (datasource.source === IntegrationTypes.REST &&
        key === "defaultHeaders") ||
      value.deprecated
    )
  }

  $: config = datasource?.config
  $: configKeys = Object.entries(schema || {})
    .filter(el => filter(el))
    .map(([key]) => key)

  let addButton

  function getDisplayName(key) {
    let name
    if (schema[key]?.display) {
      name = schema[key].display
    } else {
      name = key
    }
    return capitalise(name)
  }
</script>

<form>
  <Layout noPadding gap="S">
    {#if !creating}
      <div class="form-row">
        <Label>Name</Label>
        <Input on:change bind:value={datasource.name} />
      </div>
    {/if}
    {#each configKeys as configKey}
      {#if schema[configKey].type === "object"}
        <div class="form-row ssl">
          <Label>{getDisplayName(configKey)}</Label>
          <Button secondary thin outline on:click={addButton.addEntry()}
            >Add</Button
          >
        </div>
        <KeyValueBuilder
          bind:this={addButton}
          defaults={schema[configKey].default}
          bind:object={config[configKey]}
          on:change
          noAddButton={true}
        />
      {:else if schema[configKey].type === "boolean"}
        <div class="form-row">
          <Label>{getDisplayName(configKey)}</Label>
          <Toggle text="" bind:value={config[configKey]} />
        </div>
      {:else if schema[configKey].type === "longForm"}
        <div class="form-row">
          <Label>{getDisplayName(configKey)}</Label>
          <TextArea
            type={schema[configKey].type}
            on:change
            bind:value={config[configKey]}
          />
        </div>
      {:else}
        <div class="form-row">
          <Label>{getDisplayName(configKey)}</Label>
          <Input
            type={schema[configKey].type}
            on:change
            bind:value={config[configKey]}
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
