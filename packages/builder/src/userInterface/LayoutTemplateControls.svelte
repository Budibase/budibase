<script>
  import PlusButton from "../common/PlusButton.svelte"

  export let meta = []
  export let size = ""
  export let values = []
  export let propertyName
  export let onStyleChanged = () => {}

  let _values = values.map(v => v)

  $: onStyleChanged(_values)

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
        class:selected={cssPropValue === _values[i]}
        on:click={() => {
          const newPropertyValue = cssPropValue === _values[i] ? '' : cssPropValue
          _values[i] = newPropertyValue
        }}>
        <i class={icon} />
      </button>
    {/each}
  {/each}
</div>

<style>
  .selected {
    color: var(--button-text);
    background: var(--background-button);
  }

  button {
    cursor: pointer;
    outline: none;
    border: none;
    border-radius: 5px;
    background: rgba(249, 249, 249, 1);

    min-width: 1.6rem;
    min-height: 1.6rem;

    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 1.2rem;
    font-weight: 500;
    color: rgba(22, 48, 87, 1);
  }

  .inputs {
    display: flex;
    justify-content: space-between;
  }
</style>
