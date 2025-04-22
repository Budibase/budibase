<script lang="ts">
  import { Select } from "@budibase/bbui"
  import { componentStore, selectedScreen } from "@/stores/builder"

  import { findAllComponents, getComponentContexts } from "@/helpers/components"
  import { makePropSafe as safe } from "@budibase/string-templates"
  import { createEventDispatcher } from "svelte"
  import { extractLiteralHandlebarsID } from "@/dataBinding"
  import { type Component } from "@budibase/types"

  export let value: string | undefined = undefined

  const dispatch = createEventDispatcher()

  let providersComps: Component[]
  let providers: { label: string; value: string; subtitle: string }[]

  // Load the component for processing
  $: targetId = extractLiteralHandlebarsID(value)

  // Refresh datasources if the target is altered
  $: if (targetId) {
    providersComps = loadProviderComponents()
    providers = buildProviders()
  }

  const handleSelected = (selected: string) => {
    dispatch("change", selected)
  }

  // Components that surface data
  const buildProviders = () => {
    if (!$selectedScreen) return []
    return providersComps.map(provider => ({
      label: provider._instanceName,
      value: `{{ literal ${safe(provider._id)} }}`,
      subtitle: `${
        provider?.dataSource?.label || provider?.table?.label || "-"
      }`,
    }))
  }

  const loadProviderComponents = () => {
    if (!$selectedScreen) return []
    return findAllComponents($selectedScreen.props).filter(component => {
      if (component._id === $componentStore.selectedComponentId) return false
      const contexts = getComponentContexts(component._component)
      const targetContexts = contexts.filter(ctx =>
        ctx.actions?.find(act => act.type === "RefreshDatasource")
      )
      return !!targetContexts.length
    })
  }
</script>

<Select
  {value}
  options={providers}
  on:change={e => {
    handleSelected(e.detail)
  }}
/>
