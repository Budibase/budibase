<script>
  import FancyCheckbox from "./FancyCheckbox.svelte"
  import FancyForm from "./FancyForm.svelte"
  import { createEventDispatcher } from "svelte"

  export let options = []
  export let selected = []
  export let showSelectAll = true
  export let selectAllText = "Select all"

  let selectedBooleans = options.map(x => selected.indexOf(x) > -1)
  const dispatch = createEventDispatcher()

  $: updateSelected(selectedBooleans)
  $: allSelected = selected?.length === options.length
  $: noneSelected = !selected?.length

  function reset() {
    return Array(options.length).fill(true)
  }

  function updateSelected(selectedArr) {
    const array = []
    for (let [i, isSelected] of Object.entries(selectedArr)) {
      if (isSelected) {
        array.push(options[i])
      }
    }
    selected = array
    dispatch("change", selected)
  }

  function toggleSelectAll() {
    if (allSelected === true) {
      selectedBooleans = []
    } else {
      selectedBooleans = reset()
    }
    dispatch("change", selected)
  }
</script>

{#if options && Array.isArray(options)}
  <div class="checkbox-group" class:has-select-all={showSelectAll}>
    <FancyForm on:change>
      {#if showSelectAll}
        <FancyCheckbox
          bind:value={allSelected}
          on:change={toggleSelectAll}
          text={selectAllText}
          indeterminate={!allSelected && !noneSelected}
          compact
        />
      {/if}
      {#each options as option, i}
        <FancyCheckbox bind:value={selectedBooleans[i]} text={option} compact />
      {/each}
    </FancyForm>
  </div>
{/if}

<style>
  .checkbox-group.has-select-all :global(.fancy-field:first-of-type) {
    background: var(--spectrum-global-color-gray-100);
  }
  .checkbox-group.has-select-all :global(.fancy-field:first-of-type:hover) {
    background: var(--spectrum-global-color-gray-200);
  }
</style>
