<script>
  export let title = ""
  export let content = {}
  export let componentInstance = {}
  export let componentDefinition = {}

  let show = false

  const propExistsOnComponentDef = prop => prop in componentDefinition.props

  const capitalize = title => title[0].toUpperCase() + title.slice(1)

  $: propertyKeys = Object.keys(content)
  $: icon = show ? "ri-arrow-down-s-fill" : "ri-arrow-right-s-fill"
</script>

<div class="property-group-container" on:click={() => (show = !show)}>
  <div class="property-group-title">
    <div class="icon">
      <i class={icon} />
    </div>
    <div class="title">{capitalize(title)}</div>
  </div>
  <div class="property-panel" class:show>
    <ul>
      {#each propertyKeys as key}
        <!-- {#if propExistsOnComponentDef(key)} -->
        <li>{content[key].displayName || capitalize(key)}</li>
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

  .property-group-title {
    cursor: pointer;
    flex: 0 0 20px;
    display: flex;
    flex-flow: row nowrap;
  }

  .icon {
    flex: 0 0 20px;
    text-align: center;
  }

  .title {
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
