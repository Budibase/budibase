<script>
  import PropertyControl from "./PropertyControl.svelte"
  import InputGroup from "../common/Inputs/InputGroup.svelte"
  import Colorpicker from "../common/Colorpicker.svelte"
  import { excludeProps } from "./propertyCategories.js"

  export let panelDefinition = []
  export let componentDefinition = {}
  export let componentInstance = {}
  export let onChange = () => {}

  let pageScreenProps = ["title", "favicon", "description", "route"]
  
  const propExistsOnComponentDef = prop => pageScreenProps.includes(prop) || prop in componentDefinition.props

  function handleChange(key, data) {
    const value = data.target ? data.target.value : data
    onChange(key, value)
  }
</script>

{#if panelDefinition && panelDefinition.length > 0}
  {#each panelDefinition as definition}
    {#if propExistsOnComponentDef(definition.key)}
      <PropertyControl
        control={definition.control}
        label={definition.label}
        key={definition.key}
        value={componentInstance[definition.key]}
        {onChange}
        props={{ ...excludeProps(definition, ['control', 'label']) }} />
    {/if}
  {/each}
{:else}
  <div>
    <span>This component does not have any settings.</span>
  </div>
{/if}

<style>
  div {
    text-align: center;
  }
</style>
