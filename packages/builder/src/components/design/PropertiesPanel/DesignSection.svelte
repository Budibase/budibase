<script>
  import { DetailSummary } from "@budibase/bbui"
  import PropertyGroup from "./PropertyControls/PropertyGroup.svelte"
  import { allStyles } from "./componentStyles"
  import { store } from "builderStore"

  export let componentDefinition
  export let componentInstance
  export let openSection

  let selectedCategory = "normal"
  let currentGroup

  $: groups = componentDefinition?.styleable ? Object.keys(allStyles) : []
</script>

<DetailSummary name="Design" show={openSection === "design"} on:open>
  {#if groups.length > 0}
    {#each groups as groupName}
      <PropertyGroup
        name={groupName}
        properties={allStyles[groupName]}
        styleCategory={selectedCategory}
        onStyleChanged={store.actions.components.updateStyle}
        {componentInstance}
        open={currentGroup === groupName}
        on:open={() => (currentGroup = groupName)}
      />
    {/each}
  {:else}
    <div class="no-design">
      This component doesn't have any design properties.
    </div>
  {/if}
</DetailSummary>

<style>
  .no-design {
    font-size: var(--spectrum-global-dimension-font-size-75);
    color: var(--grey-6);
  }
</style>
