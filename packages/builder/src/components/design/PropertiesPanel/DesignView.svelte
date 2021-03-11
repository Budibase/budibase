<script>
  import { TextArea, DetailSummary, Button, Select } from "@budibase/bbui"
  import PropertyGroup from "./PropertyControls/PropertyGroup.svelte"
  import FlatButtonGroup from "./PropertyControls/FlatButtonGroup"
  import { allStyles } from "./componentStyles"

  export let componentDefinition = {}
  export let componentInstance = {}
  export let onStyleChanged = () => {}
  export let onCustomStyleChanged = () => {}
  export let onUpdateTransition = () => {}
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

  const transitions = [
    "none",
    "fade",
    "blur",
    "fly",
    "scale", // slide is hidden because it does not seem to result in any effect
  ]

  const capitalize = ([first, ...rest]) => first.toUpperCase() + rest.join("")

  $: groups = componentDefinition?.styleable ? Object.keys(allStyles) : []
</script>

<div class="container">
  <div class="state-categories">
    <FlatButtonGroup value={selectedCategory} {buttonProps} {onChange} />
  </div>

  <div class="positioned-wrapper">
    <div class="property-groups">
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
  {#if componentDefinition?.transitionable}
    <div class="transitions">
      <Select
        value={componentInstance._transition}
        on:change={event => onUpdateTransition(event.target.value)}
        name="transition"
        label="Transition"
        secondary
        thin>
        {#each transitions as transition}
          <option value={transition}>{capitalize(transition)}</option>
        {/each}
      </Select>
    </div>
  {/if}
</div>

<style>
  .container {
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

  .property-groups {
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

  option {
    text-transform: capitalize;
  }
</style>
