<script lang="ts">
  import { keepOpen, Body, Layout, ModalContent } from "@budibase/bbui"
  import ConfigInput from "./ConfigInput.svelte"
  import { createValidatedConfigStore } from "./stores/validatedConfig"
  import { createValidatedNameStore } from "./stores/validatedName"
  import { get } from "svelte/store"
  import type { UIIntegration } from "@budibase/types"
  import InfoDisplay from "@/pages/builder/workspace/[application]/design/[workspaceAppId]/[screenId]/[componentId]/_components/Component/InfoDisplay.svelte"
  import PlaybookSelect from "@/components/common/PlaybookSelect.svelte"

  export let integration: UIIntegration
  export let config: Record<string, any>
  export let onSubmit: (_value: {
    config: Record<string, any>
    name: string
    playbookId?: string
  }) => Promise<void> | void = () => {}
  export let showNameField: boolean = false
  export let nameFieldValue: string = ""
  export let showPlaybookField: boolean = false
  export let playbookIdValue: string = ""

  let playbookId = ""

  $: configStore = createValidatedConfigStore(integration, config)
  $: nameStore = createValidatedNameStore(nameFieldValue, showNameField)
  $: playbookId = playbookIdValue || ""

  const handleConfirm = async () => {
    configStore.markAllFieldsActive()
    nameStore.markActive()

    if ((await configStore.validate()) && (await nameStore.validate())) {
      const { config } = get(configStore)
      const { name } = get(nameStore)
      return onSubmit({
        config,
        name,
        playbookId: playbookId || undefined,
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
      {#if integration.warningMessage}
        <InfoDisplay
          body={integration.warningMessage}
          warning={true}
          icon="warning"
        />
      {/if}
      <p>Connect your database to Budibase using the config below.</p>
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

  {#if showPlaybookField}
    <PlaybookSelect bind:value={playbookId} />
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
