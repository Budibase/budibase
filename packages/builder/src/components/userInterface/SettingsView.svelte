<script>
  import PropertyControl from "./PropertyControl.svelte"
  import Input from "./PropertyPanelControls/Input.svelte"
  import { goto } from "@sveltech/routify"
  import { excludeProps } from "./propertyCategories.js"

  export let panelDefinition = []
  export let componentDefinition = {}
  export let componentInstance = {}
  export let onChange = () => {}
  export let displayNameField = false
  export let screenOrPageInstance

  let pageScreenProps = ["title", "favicon", "description", "route"]

  const propExistsOnComponentDef = prop =>
    pageScreenProps.includes(prop) || prop in componentDefinition.props

  function handleChange(key, data) {
    data.target ? onChange(key, data.target.value) : onChange(key, data)
  }

  const screenDefinition = [
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
      {onChange}
      props={{ ...excludeProps(def, ['control', 'label']) }} />
  {/each}
  <hr />
{/if}

{#if displayNameField}
  <PropertyControl
    control={Input}
    label="Name"
    key="_instanceName"
    value={componentInstance._instanceName}
    {onChange} />
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
