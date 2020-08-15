<script>
  export let meta = []
  export let size = ""
  export let values = []
  export let propertyName
  export let onStyleChanged = () => {}

  let selectedLayoutValues = values.map(v => v)

  $: onStyleChanged(selectedLayoutValues)

  const PROPERTY_OPTIONS = {
    Direction: {
      vertical: ["column", "ri-arrow-up-down-line"],
      horizontal: ["row", "ri-arrow-left-right-line"],
    },
    Align: {
      left: ["flex-start", "ri-layout-bottom-line"],
      center: ["center", "ri-layout-row-line"],
      right: ["flex-end", "ri-layout-top-line"],
      space: ["space-between", "ri-space"],
    },
    Justify: {
      left: ["flex-start", "ri-layout-left-line"],
      center: ["center", "ri-layout-column-line"],
      right: ["flex-end", "ri-layout-right-line"],
      space: ["space-between", "ri-space"],
    },
  }

  $: propertyChoices = Object.entries(PROPERTY_OPTIONS[propertyName])
</script>

<div class="inputs {size}">
  {#each meta as { placeholder }, i}
    {#each propertyChoices as [displayName, [cssPropValue, icon]]}
      <button
        class:selected={cssPropValue === selectedLayoutValues[i]}
        on:click={() => {
          const newPropertyValue = cssPropValue === selectedLayoutValues[i] ? '' : cssPropValue
          selectedLayoutValues[i] = newPropertyValue
        }}>
        <i class={icon} />
      </button>
    {/each}
  {/each}
</div>

<style>
  .selected {
    color: var(--blue);
    background: #f9f9f9;
    opacity: 1;
  }

  button {
    cursor: pointer;
    outline: none;
    border: none;
    border-radius: 3px;

    min-width: 1.6rem;
    min-height: 1.6rem;

    display: flex;
    justify-content: space-between;
    align-items: center;

    font-size: 1.2rem;
    font-weight: 500;
    color: var(--ink);
  }

  .inputs {
    display: flex;
    justify-content: space-between;
  }
</style>
