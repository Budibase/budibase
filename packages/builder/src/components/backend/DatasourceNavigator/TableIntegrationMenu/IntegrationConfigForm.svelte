<script>
  import {
    Label,
    Input,
    Layout,
    Toggle,
    Button,
    TextArea,
    Modal,
    EnvDropdown,
    Accordion,
    notifications,
  } from "@budibase/bbui"
  import KeyValueBuilder from "components/integration/KeyValueBuilder.svelte"
  import { capitalise } from "helpers"
  import { IntegrationTypes } from "constants/backend"
  import { createValidationStore } from "helpers/validation/yup"
  import { createEventDispatcher, onMount } from "svelte"
  import { environment, licensing, auth } from "stores/portal"
  import CreateEditVariableModal from "components/portal/environment/CreateEditVariableModal.svelte"

  export let datasource
  export let schema
  export let creating

  let createVariableModal
  let selectedKey

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
  $: dispatch(
    "valid",
    Object.values($validation.errors).filter(val => val != null).length === 0
  )

  let addButton

  function getDisplayName(key, fieldKey) {
    let name
    if (fieldKey && schema[key]["fields"][fieldKey]?.display) {
      name = schema[key]["fields"][fieldKey].display
    } else if (fieldKey) {
      name = fieldKey
    } else if (schema[key]?.display) {
      name = schema[key].display
    } else {
      name = key
    }
    return capitalise(name)
  }
  function getFieldGroupKeys(fieldGroup) {
    return Object.entries(schema[fieldGroup].fields || {})
      .filter(el => filter(el))
      .map(([key]) => key)
  }

  async function save(data) {
    try {
      await environment.createVariable(data)
      config[selectedKey] = `{{ env.${data.name} }}`
      createVariableModal.hide()
    } catch (err) {
      notifications.error(`Failed to create variable: ${err.message}`)
    }
  }

  function showModal(configKey) {
    selectedKey = configKey
    createVariableModal.show()
  }

  async function handleUpgradePanel() {
    await environment.upgradePanelOpened()
    $licensing.goToUpgradePage()
  }

  onMount(async () => {
    try {
      await environment.loadVariables()
      if ($auth.user) {
        await licensing.init()
      }
    } catch (err) {
      console.error(err)
    }
  })
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
      {:else if schema[configKey].type === "fieldGroup"}
        <Accordion
          itemName={configKey}
          initialOpen={getFieldGroupKeys(configKey).some(
            fieldKey => !!config[fieldKey]
          )}
          header={getDisplayName(configKey)}
        >
          <Layout gap="S">
            {#each getFieldGroupKeys(configKey) as fieldKey}
              <div class="form-row">
                <Label>{getDisplayName(configKey, fieldKey)}</Label>
                <Input
                  type={schema[configKey]["fields"][fieldKey]?.type}
                  on:change
                  bind:value={config[fieldKey]}
                />
              </div>
            {/each}
          </Layout>
        </Accordion>
      {:else}
        <div class="form-row">
          <Label>{getDisplayName(configKey)}</Label>
          <EnvDropdown
            showModal={() => showModal(configKey)}
            variables={$environment.variables}
            type={configKey === "port" ? "string" : schema[configKey].type}
            on:change
            bind:value={config[configKey]}
            error={$validation.errors[configKey]}
            environmentVariablesEnabled={$licensing.environmentVariablesEnabled}
            {handleUpgradePanel}
          />
        </div>
      {/if}
    {/each}
  </Layout>
</form>

<Modal bind:this={createVariableModal}>
  <CreateEditVariableModal {save} />
</Modal>

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
