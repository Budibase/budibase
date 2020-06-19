<script>
  import PropertyControl from "./PropertyControl.svelte"
  import InputGroup from "../common/Inputs/InputGroup.svelte"
  import Colorpicker from "../common/Colorpicker.svelte"
  import { goto } from "@sveltech/routify"
  import { excludeProps } from "./propertyCategories.js"
  import Input from "../common/Input.svelte"

  export let panelDefinition = []
  export let componentDefinition = {}
  export let componentInstance = {}
  export let onChange = () => {}
  export let onScreenPropChange = () => {}
  export let screenOrPageInstance

  const propExistsOnComponentDef = prop => prop in componentDefinition.props

  function handleChange(key, data) {
    data.target ? onChange(key, data.target.value) : onChange(key, data)
  }

  function handleScreenPropChange(name, value) {
    onScreenPropChange(name, value)
    if (!isPage && name === "name") {
      // screen name is changed... change URL
      $goto(`./:page/${value}`)
    }
  }

  const screenDefinition = [
    { key: "name", label: "Name", control: Input },
    { key: "description", label: "Description", control: Input },
    { key: "route", label: "Route", control: Input },
  ]

  const pageDefinition = [
    { key: "title", label: "Title", control: Input },
    { key: "favicon", label: "Favicon", control: Input },
  ]

  $: isPage = screenOrPageInstance && screenOrPageInstance.favicon
  $: screenOrPageDefinition = isPage ? pageDefinition : screenDefinition
</script>

{#if screenOrPageInstance}
  {#each screenOrPageDefinition as def}
    <PropertyControl
      control={def.control}
      label={def.label}
      key={def.key}
      value={screenOrPageInstance[def.key]}
      onChange={handleScreenPropChange}
      props={{ ...excludeProps(def, ['control', 'label']) }} />
  {/each}
  <hr />
{/if}

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
