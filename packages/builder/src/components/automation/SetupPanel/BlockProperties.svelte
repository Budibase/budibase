<script lang="ts">
  import { automationStore } from "@/stores/builder"
  import { memo } from "@budibase/frontend-core"
  import { environment } from "@/stores/portal"
  import {
    type AutomationStep,
    type AutomationTrigger,
    type Automation,
  } from "@budibase/types"
  import { type SchemaConfigProps } from "@/types/automations"
  import { writable } from "svelte/store"
  import { getCustomStepLayout } from "./layouts"
  import AutomationSchemaLayout from "./AutomationSchemaLayout.svelte"
  import AutomationCustomLayout from "./AutomationCustomLayout.svelte"

  export let block: AutomationStep | AutomationTrigger | undefined = undefined
  export let automation: Automation | undefined = undefined
  export let context: {} | undefined

  const memoEnvVariables = memo($environment.variables)

  // Databindings requires TypeScript conversion
  let environmentBindings: any[]

  // All bindings available to this point
  $: availableBindings = automationStore.actions.getPathBindings(
    block?.id,
    automation
  )

  // Fetch the env bindings
  $: if ($memoEnvVariables) {
    environmentBindings = automationStore.actions.buildEnvironmentBindings()
  }
  $: userBindings = automationStore.actions.buildUserBindings()
  $: settingBindings = automationStore.actions.buildSettingBindings()

  // Combine all bindings for the step
  $: bindings = [
    ...availableBindings,
    ...environmentBindings,
    ...userBindings,
    ...settingBindings,
  ]

  // Store for any UX related data
  const stepStore = writable<Record<string, any>>({})
  $: if (block?.id) {
    stepStore.update(state => ({ ...state, [block.id]: {} }))
  }

  // Determine if any custom step layouts have been created
  let customLayout: SchemaConfigProps[] | undefined
  $: if ($stepStore) {
    customLayout = getCustomStepLayout(block, stepStore)
  }
</script>

{#if customLayout}
  <!-- Render 1 or more components in a custom layout -->
  <AutomationCustomLayout {context} {bindings} {block} layout={customLayout} />
{:else}
  <!-- Render Automation Step Schema > [string, BaseIOStructure][] -->
  <AutomationSchemaLayout {context} {bindings} {block} />
{/if}
