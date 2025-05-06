<script lang="ts">
  import { Select } from "@budibase/bbui"
  import { selectedScreen } from "@/stores/builder"
  import { findAllComponents, getComponentContexts } from "@/helpers/components"
  import { makePropSafe as safe } from "@budibase/string-templates"
  import { type Component } from "@budibase/types"

  export let value: string | undefined = undefined

  $: providers = getProviders($selectedScreen?.props)

  const getProviders = (rootComponent: Component | undefined) => {
    if (!rootComponent) {
      return []
    }
    return findAllComponents(rootComponent)
      .filter(component => {
        return getComponentContexts(component._component).some(ctx =>
          ctx.actions?.find(
            act =>
              act.type === "AddDataProviderQueryExtension" ||
              act.type === "AddDataProviderFilterExtension"
          )
        )
      })
      .map(provider => ({
        label: provider._instanceName,
        value: `{{ literal ${safe(provider._id)} }}`,
        subtitle: `${
          provider?.dataSource?.label || provider?.table?.label || "-"
        }`,
      }))
  }
</script>

<Select {value} options={providers} on:change />
