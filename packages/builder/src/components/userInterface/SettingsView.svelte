<script>
  import { isEmpty } from "lodash/fp"
  import PropertyControl from "./PropertyControl.svelte"
  import Input from "./PropertyPanelControls/Input.svelte"
  import { goto } from "@sveltech/routify"
  import { excludeProps } from "./propertyCategories.js"
  import { store } from "builderStore"
  import { walkProps } from "builderStore/storeUtils"

  export let panelDefinition = []
  export let componentDefinition = {}
  export let componentInstance = {}
  export let onChange = () => {}
  export let displayNameField = false
  export let screenOrPageInstance

  let pageScreenProps = ["title", "favicon", "description", "route"]
  let duplicateName = false

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

  const canRenderControl = (key, dependsOn) => {
    let test = !isEmpty(componentInstance[dependsOn])

    return (
      propExistsOnComponentDef(key) &&
      (!dependsOn || !isEmpty(componentInstance[dependsOn]))
    )
  }

  $: isPage = screenOrPageInstance && screenOrPageInstance.favicon
  $: screenOrPageDefinition = isPage ? pageDefinition : screenDefinition

  const isDuplicateName = name => {
    let duplicate = false

    const lookForDuplicate = rootPops => {
      walkProps(rootPops, (inst, cancel) => {
        if (inst._instanceName === name && inst._id !== componentInstance._id) {
          duplicate = true
          cancel()
        }
      })
    }
    // check page first
    lookForDuplicate($store.pages[$store.currentPageName].props)
    if (duplicate) return true

    // if viwing screen, check current screen for duplicate
    if ($store.currentFrontEndType === "screen") {
      lookForDuplicate($store.currentPreviewItem.props)
    } else {
      // viewing master page - need to dedupe against all screens
      for (let screen of $store.screens) {
        lookForDuplicate(screen.props)
      }
    }

    return duplicate
  }

  const onInstanceNameChange = (_, name) => {
    if (isDuplicateName(name)) {
      duplicateName = true
    } else {
      duplicateName = false
      onChange("_instanceName", name)
    }
  }
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
    onChange={onInstanceNameChange} />
  {#if duplicateName}
    <span class="duplicate-name">Name must be unique</span>
  {/if}
{/if}

{#if panelDefinition && panelDefinition.length > 0}
  {#each panelDefinition as definition}
    {#if canRenderControl(definition.key, definition.dependsOn)}
      <PropertyControl
        control={definition.control}
        label={definition.label}
        key={definition.key}
        value={componentInstance[definition.key] || componentInstance[definition.key].defaultValue}
        {componentInstance}
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

  .duplicate-name {
    color: var(--red);
    font-size: var(--font-size-xs);
    position: relative;
    top: -10px;
  }
</style>
