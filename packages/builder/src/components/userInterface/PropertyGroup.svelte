<script>
  import { excludeProps } from "./propertyCategories.js"
  export let name = ""
  export let properties = {}
  export let componentInstance = {}
  export let componentDefinition = {}
  export let onPropChanged = () => {}

  let show = true

  const propExistsOnComponentDef = prop => prop in componentDefinition.props
  const capitalize = name => name[0].toUpperCase() + name.slice(1)

  function onChange(v) {
    !!v.target ? onPropChanged(v.target.value) : onPropChanged(v)
  }

  $: propertyDefinition = Object.entries(properties)
  $: console.log("props group", properties)
  $: icon = show ? "ri-arrow-down-s-fill" : "ri-arrow-right-s-fill"
</script>

<!-- () => (show = !show) -->
<div class="property-group-container" on:click={() => {}}>
  <div class="property-group-name">
    <div class="icon">
      <i class={icon} />
    </div>
    <div class="name">{capitalize(name)}</div>
  </div>
  <div class="property-panel" class:show>

    {#each propertyDefinition as [key, definition]}
      <div class="property-control">
        {#if propExistsOnComponentDef(key)}
          <span>{definition.label || capitalize(key)}</span>
          <svelte:component
            this={definition.control}
            value={componentInstance[key]}
            on:change={onChange}
            {onChange}
            {...excludeProps(definition, ['control'])} />
        {/if}
      </div>
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

  .icon {
    flex: 0 0 20px;
    text-align: center;
  }

  .name {
    flex: 1;
    text-align: left;
  }

  .property-panel {
    height: 0px;
    overflow: hidden;
  }

  .property-control {
    display: flex;
    flex-flow: row nowrap;
  }

  .show {
    overflow: auto;
    height: auto;
  }
</style>
