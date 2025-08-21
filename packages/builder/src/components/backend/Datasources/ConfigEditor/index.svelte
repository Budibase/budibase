<script lang="ts">
  import { keepOpen, Body, Layout, ModalContent } from "@budibase/bbui"
  import ConfigInput from "./ConfigInput.svelte"
  import { createValidatedConfigStore } from "./stores/validatedConfig"
  import { createValidatedNameStore } from "./stores/validatedName"
  import { get } from "svelte/store"
  import type { UIIntegration } from "@budibase/types"

  export let integration: UIIntegration
  export let config: Record<string, any>
  export let onSubmit: (_value: {
    config: Record<string, any>
    name: string
  }) => Promise<void> | void = () => {}
  export let showNameField: boolean = false
  export let nameFieldValue: string = ""

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
      on:blur={nameStore.markActive}
      on:change={e => nameStore.updateValue(e.detail)}
    />
  {/if}

  {#each $configStore.validatedConfig as { type, key, value, error, name, config, placeholder }}
    <ConfigInput
      {type}
      {value}
      {error}
      {name}
      {config}
      {placeholder}
      on:blur={() => configStore.markFieldActive(key)}
      on:change={e => configStore.updateFieldValue(key, e.detail)}
      on:nestedFieldBlur={e =>
        configStore.markFieldActive(`${key}.${e.detail}`)}
    />
  {/each}
</ModalContent>
