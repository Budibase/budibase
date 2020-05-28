<script>
  import PropertyControl from "./PropertyControl.svelte"
  import InputGroup from "../common/Inputs/InputGroup.svelte"
  import Colorpicker from "../common/Colorpicker.svelte"
  import { excludeProps } from "./propertyCategories.js"
  import OptionSelectNew from "./OptionSelectNew.svelte"

  export let panelDefinition = []
  export let componentDefinition = {}
  export let componentInstance = {}
  export let onChange = () => {}

  const propExistsOnComponentDef = prop => prop in componentDefinition.props

  function handleChange(key, data) {
    data.target ? onChange(key, data.target.value) : onChange(key, data)
  }
</script>

<OptionSelectNew
  options={['arial enjfhewhfhw iejfiewj ewfnew', 'comicsans', 'tachoma', 'bla']} />

{#if panelDefinition.length > 0}
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
