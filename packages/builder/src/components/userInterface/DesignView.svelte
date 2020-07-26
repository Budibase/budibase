<script>
  import { onMount } from "svelte"
  import PropertyGroup from "./PropertyGroup.svelte"
  import FlatButtonGroup from "./FlatButtonGroup.svelte"

  export let panelDefinition = {}
  export let componentInstance = {}
  export let componentDefinition = {}
  export let onStyleChanged = () => {}

  let selectedCategory = "normal"
  let propGroup = null
  let currentGroup

  const getProperties = name => panelDefinition[name]

  onMount(() => {
    // if(propGroup) {
    //   propGroup.addEventListener("scroll", function(e){
    //     console.log("I SCROLLED", e.target.scrollTop)
    //   })
    // }
  })

  function onChange(category) {
    selectedCategory = category
  }

  const buttonProps = [
    { value: "normal", text: "Normal" },
    { value: "hover", text: "Hover" },
    { value: "active", text: "Active" },
  ]

  $: propertyGroupNames = panelDefinition ? Object.keys(panelDefinition) : []
</script>

<div class="design-view-container">

  <div class="design-view-state-categories">
    <FlatButtonGroup value={selectedCategory} {buttonProps} {onChange} />
  </div>

  <div class="positioned-wrapper">
    <div bind:this={propGroup} class="design-view-property-groups">
      {#if propertyGroupNames.length > 0}
        {#each propertyGroupNames as groupName}
          <PropertyGroup
            name={groupName}
            properties={getProperties(groupName)}
            styleCategory={selectedCategory}
            {onStyleChanged}
            {componentDefinition}
            {componentInstance}
            open={currentGroup === groupName}
            on:open={() => (currentGroup = groupName)} />
        {/each}
      {:else}
        <div class="no-design">
          <span>This component does not have any design properties</span>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .design-view-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  .design-view-state-categories {
    flex: 0 0 50px;
  }

  .positioned-wrapper {
    position: relative;
    display: flex;
    min-height: 0;
  }

  .design-view-property-groups {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }

  .no-design {
    text-align: center;
  }
</style>
