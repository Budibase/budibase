<script>
  import {
    Modal,
    notifications,
    Body,
    Layout,
    ModalContent,
  } from "@budibase/bbui"
  import CreateEditVariableModal from "components/portal/environment/CreateEditVariableModal.svelte"
  import ConfigInput from "./ConfigInput.svelte"
  import { createConfigStore } from "./stores/config"
  import { createValidationStore } from "./stores/validation"
  import { createValidatedConfigStore } from "./stores/validatedConfig"
  import { datasources } from "stores/backend"
  import { get } from "svelte/store"
  import { environment } from "stores/portal"

  export let integration
  export let config
  export let onDatasourceCreated = () => {}

  $: configStore = createConfigStore(integration, config)
  $: validationStore = createValidationStore(integration)
  $: validatedConfigStore = createValidatedConfigStore(
    configStore,
    validationStore,
    integration
  )

  const handleConfirm = async () => {
    validationStore.markAllFieldsActive()
    const config = get(configStore)

    try {
      if (await validationStore.validate(config)) {
        const datasource = await datasources.create({
          integration,
          fields: config,
        })
        await onDatasourceCreated(datasource)
      } else {
        notifications.send("Invalid fields", {
          type: "error",
          icon: "Alert",
          autoDismiss: true,
        })
      }
    } catch (e) {
      // Do nothing on errors, alerts are handled by `datasources.create`
    }

    // Prevent modal closing
    return false
  }

  const handleBlur = key => {
    validationStore.markFieldActive(key)
    validationStore.validate(get(configStore))
  }

  const handleChange = (key, newValue) => {
    configStore.updateFieldValue(key, newValue)
    validationStore.validate(get(configStore))
  }

  let createVariableModal
  let selectedConfigKey

  const showModal = key => {
    selectedConfigKey = key
    createVariableModal.show()
  }

  async function save(data) {
    try {
      await environment.createVariable(data)
      configStore.updateFieldValue(selectedConfigKey, `{{ env.${data.name} }}`)
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
  disabled={$validationStore.allFieldsActive && $validationStore.invalid}
  size="L"
>
  <Layout noPadding>
    <Body size="XS">
      Connect your database to Budibase using the config below.
    </Body>
  </Layout>

  {#each $validatedConfigStore as { type, key, value, error, name }}
    <ConfigInput
      {type}
      {value}
      {error}
      {name}
      showModal={() => showModal(key)}
      on:blur={() => handleBlur(key)}
      on:change={e => handleChange(key, e.detail)}
    />
  {/each}
</ModalContent>

<Modal bind:this={createVariableModal}>
  <CreateEditVariableModal {save} />
</Modal>
