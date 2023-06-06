<script>
  import FancyCheckbox from "./FancyCheckbox.svelte"
  import FancyForm from "./FancyForm.svelte"

  export let options = []
  export let selected
  export let showSelectAll = true
  export let selectAllText = "Select all"

  let selectedBooleans = reset()

  $: selected = updateSelected(selectedBooleans)
  $: console.log(selected)
  $: allSelected = selected.length === options.length

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
    return array
  }

  function toggleSelectAll() {
    if (allSelected === true) {
      selectedBooleans = []
    } else {
      selectedBooleans = reset()
    }
  }
</script>

{#if options && Array.isArray(options)}
  <FancyForm compact noMaxWidth on:change>
    {#if showSelectAll}
      <div class="checkbox-item">
        <FancyCheckbox
          bind:value={allSelected}
          on:change={toggleSelectAll}
          text={selectAllText}
          compress
          lighter
        />
      </div>
    {/if}
    {#each options as option, i}
      <FancyCheckbox bind:value={selectedBooleans[i]} text={option} compress />
    {/each}
  </FancyForm>
{/if}

<style>
  .checkbox-item:hover {
    background-color: rgba(255, 255, 255, 0.01);
  }
</style>
