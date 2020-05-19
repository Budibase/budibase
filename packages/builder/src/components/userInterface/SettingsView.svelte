<script>
  import PropertyControl from "./PropertyControl.svelte"
  import InputGroup from "../common/Inputs/InputGroup.svelte"
  import { excludeProps } from "./propertyCategories.js"

  export let panelDefinition = []
  export let componentDefinition = {}
  export let componentInstance = {}
  export let onChange = () => {}

  const propExistsOnComponentDef = prop => prop in componentDefinition.props

  function handleChange(key, data) {
    data.target ? onChange(key, data.target.value) : onChange(key, data)
  }
</script>

{#each panelDefinition as definition}
  {#if propExistsOnComponentDef(definition.key)}
    <PropertyControl
      control={definition.control}
      label={definition.label}
      key={definition.key}
      value={componentInstance[definition.key]}
      {onChange}
      props={{ ...excludeProps(definition, ['control']) }} />
  {/if}
{/each}
