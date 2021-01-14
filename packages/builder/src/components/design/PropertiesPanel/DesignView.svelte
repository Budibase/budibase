<script>
  import { TextArea, DetailSummary, Button } from "@budibase/bbui"
  import PropertyGroup from "./PropertyPanelControls/PropertyGroup.svelte"
  import FlatButtonGroup from "./PropertyPanelControls/FlatButtonGroup"
  import { allStyles } from "./componentStyles"

  export let componentDefinition = {}
  export let componentInstance = {}
  export let onStyleChanged = () => {}
  export let onCustomStyleChanged = () => {}
  export let onResetStyles = () => {}

  let selectedCategory = "normal"
  let currentGroup

  function onChange(category) {
    selectedCategory = category
  }

  const buttonProps = [
    { value: "normal", text: "Normal" },
    { value: "hover", text: "Hover" },
    { value: "active", text: "Active" },
  ]

  $: groups = componentDefinition?.styleable ? Object.keys(allStyles) : []
</script>

<div class="design-view-container">
  <div class="design-view-state-categories">
    <FlatButtonGroup value={selectedCategory} {buttonProps} {onChange} />
  </div>

  <div class="positioned-wrapper">
    <div class="design-view-property-groups">
      {#if groups.length > 0}
        {#each groups as groupName}
          <PropertyGroup
            name={groupName}
            properties={allStyles[groupName]}
            styleCategory={selectedCategory}
            {onStyleChanged}
            {componentInstance}
            open={currentGroup === groupName}
            on:open={() => (currentGroup = groupName)} />
        {/each}
        <DetailSummary
          name={`Custom Styles${componentInstance._styles.custom ? ' *' : ''}`}
          on:open={() => (currentGroup = 'custom')}
          show={currentGroup === 'custom'}
          thin>
          <div class="custom-styles">
            <TextArea
              value={componentInstance._styles.custom}
              on:change={event => onCustomStyleChanged(event.target.value)}
              placeholder="Enter some CSS..." />
          </div>
        </DetailSummary>
        <Button secondary wide on:click={onResetStyles}>Reset Styles</Button>
      {:else}
        <div class="no-design">
          This component doesn't have any design properties.
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
    gap: var(--spacing-l);
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
    margin: 0 -20px;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-m);
  }

  .no-design {
    font-size: var(--font-size-xs);
    color: var(--grey-5);
  }

  .custom-styles :global(textarea) {
    font-family: monospace;
    min-height: 120px;
    font-size: var(--font-size-xs);
  }
</style>
