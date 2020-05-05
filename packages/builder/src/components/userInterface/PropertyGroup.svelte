<script>
  export let name = ""
  export let properties = {}
  export let componentInstance = {}
  export let componentDefinition = {}

  let show = false

  const propExistsOnComponentDef = prop => prop in componentDefinition.props

  const capitalize = name => name[0].toUpperCase() + name.slice(1)

  $: propertyKeys = Object.keys(properties)
  $: icon = show ? "ri-arrow-down-s-fill" : "ri-arrow-right-s-fill"
</script>

<div class="property-group-container" on:click={() => (show = !show)}>
  <div class="property-group-name">
    <div class="icon">
      <i class={icon} />
    </div>
    <div class="name">{capitalize(name)}</div>
  </div>
  <div class="property-panel" class:show>
    <ul>
      {#each propertyKeys as key}
        <!-- {#if propExistsOnComponentDef(key)} -->
        <li>{properties[key].label || capitalize(key)}</li>
        <!-- {/if} -->
      {/each}
    </ul>
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
    /* transition: height 2s ease-in-out; */
  }

  .show {
    overflow: auto;
    height: auto;
  }
</style>
