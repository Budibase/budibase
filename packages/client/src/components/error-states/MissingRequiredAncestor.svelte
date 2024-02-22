<script>
  import { getContext } from "svelte"
  import { BudibasePrefix } from "stores/components"

  export let requiredAncestor

  const component = getContext("component")
  const { builderStore, componentStore } = getContext("sdk")

  $: definition = componentStore.actions.getComponentDefinition($component.type)
  $: fullAncestorType = `${BudibasePrefix}${requiredAncestor}`
  $: ancestorDefinition =
    componentStore.actions.getComponentDefinition(fullAncestorType)
  $: pluralName = getPluralName(definition?.name, $component.type)
  $: ancestorName = getAncestorName(ancestorDefinition?.name, requiredAncestor)

  const getPluralName = (name, type) => {
    if (!name) {
      name = type.replace(BudibasePrefix, "")
    }
    return name.endsWith("s") ? `${name}'` : `${name}s`
  }

  const getAncestorName = name => {
    return name || requiredAncestor
  }
</script>

<span>
  {pluralName} need to be inside a
  <mark>{ancestorName}</mark>
</span>
<span>-</span>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span
  class="spectrum-Link"
  on:click={() => {
    builderStore.actions.addParentComponent($component.id, fullAncestorType)
  }}
>
  Add {ancestorName}
</span>
