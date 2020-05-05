<script>
  import PropertyGroup from "./PropertyGroup.svelte"

  export let panelDefinition = {}
  export let componentInstance = {}
  export let componentDefinition = {}
  const getProperties = name => panelDefinition.properties[name]

  $: propertyGroupNames =
    !!panelDefinition.properties && Object.keys(panelDefinition.properties)
</script>

{#each propertyGroupNames as groupName}
  <PropertyGroup
    name={groupName}
    properties={getProperties(groupName)}
    {componentDefinition}
    {componentInstance} />
{/each}
