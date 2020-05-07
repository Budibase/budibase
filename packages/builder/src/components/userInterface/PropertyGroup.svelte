<script>
  import { excludeProps } from "./propertyCategories.js"
  import PropertyControl from "./PropertyControl.svelte"
  export let name = ""
  export let properties = {}
  export let componentInstance = {}
  export let componentDefinition = {}
  export let onPropChanged = () => {}

  export let show = false

  const propExistsOnComponentDef = prop => prop in componentDefinition.props
  const capitalize = name => name[0].toUpperCase() + name.slice(1)

  function onChange(key, v) {
    !!v.target ? onPropChanged(key, v.target.value) : onPropChanged(key, v)
  }

  $: propertyDefinition = Object.entries(properties)
  $: icon = show ? "ri-arrow-down-s-fill" : "ri-arrow-right-s-fill"
</script>

<div class="property-group-container">
  <div class="property-group-name" on:click={() => (show = !show)}>
    <div class="icon">
      <i class={icon} />
    </div>
    <div class="name">{capitalize(name)}</div>
  </div>
  <div class="property-panel" class:show>

    {#each propertyDefinition as [key, definition]}
      <!-- {#if propExistsOnComponentDef(key)} -->
      <PropertyControl
        label={definition.label || capitalize(key)}
        control={definition.control}
        value={componentInstance[key]}
        onChange={value => onChange(key, value)}
        props={{ ...excludeProps(definition, ['control']) }} />
      <!-- {/if} -->
    {/each}
  </div>
</div>

<style>
  .property-group-container {
    display: flex;
    flex-direction: column;
    height: auto;
    background: #fbfbfb;
    margin: 5px;
    padding: 5px;
  }

  .property-group-name {
    cursor: pointer;
    flex: 0 0 20px;
    display: flex;
    flex-flow: row nowrap;
  }

  .name {
    flex: 1;
    text-align: left;
    padding-top: 2px;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.14px;
    color: #393c44;
  }

  .icon {
    flex: 0 0 20px;
    text-align: center;
  }

  .property-panel {
    height: 0px;
    overflow: hidden;
  }

  .show {
    overflow: auto;
    height: auto;
  }
</style>
