<script>
  import PropertyGroup from "./PropertyGroup.svelte"
  export let panelDefinition = {}
  export let componentInstance = {}
  export let componentDefinition = {}
  const getProperties = prop => panelDefinition.props[prop]

  $: props = !!panelDefinition.props && Object.keys(panelDefinition.props)
</script>

{#each props as prop}
  <PropertyGroup
    title={prop}
    content={getProperties(prop)}
    {componentDefinition}
    {componentInstance} />
{/each}
