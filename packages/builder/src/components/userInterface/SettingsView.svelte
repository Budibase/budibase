<script>
  import { isEmpty } from "lodash/fp"
  import { FrontendTypes } from "constants"
  import PropertyControl from "./PropertyControl.svelte"
  import LayoutSelect from "./LayoutSelect.svelte"
  import Input from "./PropertyPanelControls/Input.svelte"
  import { excludeProps } from "./propertyCategories.js"
  import { store, allScreens } from "builderStore"
  import { walkProps } from "builderStore/storeUtils"

  export let panelDefinition = []
  export let componentDefinition = {}
  export let componentInstance = {}
  export let onChange = () => {}
  export let onScreenPropChange = () => {}
  export let displayNameField = false
  export let assetInstance

  let assetProps = ["title", "description", "route", "layoutId"]
  let duplicateName = false

  const propExistsOnComponentDef = prop =>
    assetProps.includes(prop) || prop in componentDefinition.props

  function handleChange(key, data) {
    data.target ? onChange(key, data.target.value) : onChange(key, data)
  }

  const screenDefinition = [
    { key: "description", label: "Description", control: Input },
    { key: "route", label: "Route", control: Input },
    { key: "layoutId", label: "Layout", control: LayoutSelect },
  ]

  const layoutDefinition = [
    { key: "title", label: "Title", control: Input }
  ]

  const canRenderControl = (key, dependsOn) => {
    let test = !isEmpty(componentInstance[dependsOn])

    return (
      propExistsOnComponentDef(key) &&
      (!dependsOn || !isEmpty(componentInstance[dependsOn]))
    )
  }

  $: isLayout = assetInstance && assetInstance.favicon
  $: assetDefinition = isLayout ? layoutDefinition : screenDefinition

  const isDuplicateName = name => {
    let duplicate = false

    const lookForDuplicate = rootProps => {
      walkProps(rootProps, (inst, cancel) => {
        if (inst._instanceName === name && inst._id !== componentInstance._id) {
          duplicate = true
          cancel()
        }
      })
    }
    // check against layouts
    for (let layout of $store.layouts) {
      lookForDuplicate(layout.props)
    }
    // if viewing screen, check current screen for duplicate
    if ($store.currentFrontEndType === FrontendTypes.SCREEN) {
      lookForDuplicate($store.currentPreviewItem.props)
    } else {
      // need to dedupe against all screens
      for (let screen of $allScreens) {
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

<div class="settings-view-container">
  {#if assetInstance}
    {#each assetDefinition as def}
      <PropertyControl
        bindable={false}
        control={def.control}
        label={def.label}
        key={def.key}
        value={assetInstance[def.key]}
        onChange={onScreenPropChange}
        props={{ ...excludeProps(def, ['control', 'label']) }} />
    {/each}
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
          value={componentInstance[definition.key] ?? componentInstance[definition.key]?.defaultValue}
          {componentInstance}
          {onChange}
          props={{ ...excludeProps(definition, ['control', 'label']) }} />
      {/if}
    {/each}
  {:else}
    <div class="empty">
      This component doesn't have any additional settings.
    </div>
  {/if}
</div>

<style>
  .settings-view-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    gap: var(--spacing-s);
  }

  .empty {
    font-size: var(--font-size-xs);
    margin-top: var(--spacing-m);
    color: var(--grey-5);
  }

  .duplicate-name {
    color: var(--red);
    font-size: var(--font-size-xs);
    position: relative;
    top: -10px;
  }
</style>
