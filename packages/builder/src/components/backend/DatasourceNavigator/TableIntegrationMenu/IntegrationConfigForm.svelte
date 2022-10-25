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
  import { createValidationStore } from "helpers/validation/yup"
  import { createEventDispatcher } from "svelte"

  export let datasource
  export let schema
  export let creating
  const validation = createValidationStore()
  const dispatch = createEventDispatcher()

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

  // setup the validation for each required field
  $: configKeys.forEach(key => {
    if (schema[key].required) {
      validation.addValidatorType(key, schema[key].type, schema[key].required)
    }
  })
  // run the validation whenever the config changes
  $: validation.check(config)
  // dispatch the validation result
  $: dispatch("valid", $validation.valid)

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
            error={$validation.errors[configKey]}
          />
        </div>
      {:else}
        <div class="form-row">
          <Label>{getDisplayName(configKey)}</Label>
          <Input
            type={schema[configKey].type}
            on:change
            bind:value={config[configKey]}
            error={$validation.errors[configKey]}
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
