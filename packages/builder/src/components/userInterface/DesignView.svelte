<script>
  import PropertyGroup from "./PropertyGroup.svelte"

  export let panelDefinition = {}
  export let componentInstance = {}
  export let componentDefinition = {}
  export let onPropChanged = () => {}

  const getProperties = name => panelDefinition.properties[name]

  $: console.log("PDEF", panelDefinition)
  $: propertyGroupNames =
    !!panelDefinition.properties && Object.keys(panelDefinition.properties)
</script>

{#each propertyGroupNames as groupName}
  <PropertyGroup
    name={groupName}
    properties={getProperties(groupName)}
    {onPropChanged}
    {componentDefinition}
    {componentInstance} />
{/each}
