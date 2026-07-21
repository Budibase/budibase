<script lang="ts">
  import { keepOpen, Body, Layout, ModalContent } from "@budibase/bbui"
  import ConfigInput from "./ConfigInput.svelte"
  import { createValidatedConfigStore } from "./stores/validatedConfig"
  import { createValidatedNameStore } from "./stores/validatedName"
  import { get } from "svelte/store"
  import { FeatureFlag, type UIIntegration } from "@budibase/types"
  import InfoDisplay from "@/pages/builder/workspace/[application]/design/[workspaceAppId]/[screenId]/[componentId]/_components/Component/InfoDisplay.svelte"
  import ProjectSelect from "@/components/common/ProjectSelect.svelte"
  import { featureFlags } from "@/stores/portal"

  export let integration: UIIntegration
  export let config: Record<string, any>
  export let onSubmit: (_value: {
    config: Record<string, any>
    name: string
    projectIds?: string[]
  }) => Promise<void | typeof keepOpen> | void | typeof keepOpen = () => {}
  export let showNameField: boolean = false
  export let nameFieldValue: string = ""
  export let showProjectField: boolean = false
  export let projectIdsValue: string[] = []
  export let originalProjectIdsValue: string[] | undefined = undefined

  let projectIds: string[] = []

  $: configStore = createValidatedConfigStore(integration, config)
  $: nameStore = createValidatedNameStore(nameFieldValue, showNameField)
  $: projectIds = projectIdsValue || []

  const getSubmittedProjectIds = () => {
    if (!$featureFlags[FeatureFlag.PROJECTS]) {
      return undefined
    }
    if (projectIds.length) {
      return projectIds
    }
    if (
      originalProjectIdsValue &&
      JSON.stringify(projectIds) !== JSON.stringify(originalProjectIdsValue)
    ) {
      return []
    }
    return undefined
  }

  const handleConfirm = async () => {
    configStore.markAllFieldsActive()
    nameStore.markActive()

    if ((await configStore.validate()) && (await nameStore.validate())) {
      const { config } = get(configStore)
      const { name } = get(nameStore)
      return onSubmit({
        config,
        name,
        projectIds: getSubmittedProjectIds(),
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

  {#if showProjectField}
    <ProjectSelect bind:value={projectIds} />
  {/if}

  {#each $configStore.validatedConfig as { type, key, value, error, name, config, placeholder } (key)}
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
