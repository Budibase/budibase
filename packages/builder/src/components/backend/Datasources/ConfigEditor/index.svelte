<script>
  import {
    keepOpen,
    Modal,
    notifications,
    Body,
    Layout,
    ModalContent,
  } from "@budibase/bbui"
  import { processStringSync } from "@budibase/string-templates"
  import CreateEditVariableModal from "components/portal/environment/CreateEditVariableModal.svelte"
  import ConfigInput from "./ConfigInput.svelte"
  import { createValidatedConfigStore } from "./stores/validatedConfig"
  import { createValidatedNameStore } from "./stores/validatedName"
  import { get } from "svelte/store"
  import { environment } from "stores/portal"

  export let integration
  export let config
  export let onSubmit = () => {}
  export let showNameField = false
  export let nameFieldValue = ""

  $: configStore = createValidatedConfigStore(integration, config)
  $: nameStore = createValidatedNameStore(nameFieldValue, showNameField)

  const handleConfirm = async () => {
    configStore.markAllFieldsActive()
    nameStore.markActive()

    if ((await configStore.validate()) && (await nameStore.validate())) {
      const { config } = get(configStore)
      const { name } = get(nameStore)
      return onSubmit({
        config,
        name,
      })
    }

    return keepOpen
  }

  let createVariableModal
  let configValueSetterCallback = () => {}

  const showModal = setter => {
    configValueSetterCallback = setter
    createVariableModal.show()
  }

  async function saveVariable(data) {
    try {
      await environment.createVariable(data)
      configValueSetterCallback(`{{ env.${data.name} }}`)
      createVariableModal.hide()
    } catch (err) {
      notifications.error(`Failed to create variable: ${err.message}`)
    }
  }
</script>

<ModalContent
  title={`Connect to ${integration.friendlyName}`}
  onConfirm={handleConfirm}
  confirmText={integration.plus ? "Connect" : "Save and continue to query"}
  cancelText="Back"
  disabled={$configStore.preventSubmit || $nameStore.preventSubmit}
  size="L"
>
  <Layout noPadding>
    <Body size="XS">
      Connect your database to Budibase using the config below.
    </Body>
  </Layout>

  {#if showNameField}
    <ConfigInput
      type="string"
      value={$nameStore.name}
      error={$nameStore.error}
      name="Name"
      showModal={() => showModal(nameStore.updateValue)}
      on:blur={nameStore.markActive}
      on:change={e => nameStore.updateValue(e.detail)}
    />
  {/if}

  {#each $configStore.validatedConfig as { type, key, value, error, name, hidden, config }}
    {#if hidden === undefined || !eval(processStringSync(hidden, $configStore.config))}
      <ConfigInput
        {type}
        {value}
        {error}
        {name}
        {config}
        showModal={() =>
          showModal(newValue => configStore.updateFieldValue(key, newValue))}
        on:blur={() => configStore.markFieldActive(key)}
        on:change={e => configStore.updateFieldValue(key, e.detail)}
      />
    {/if}
  {/each}
</ModalContent>

<Modal bind:this={createVariableModal}>
  <CreateEditVariableModal save={saveVariable} />
</Modal>
