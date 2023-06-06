<script>
  import FancyCheckbox from "./FancyCheckbox.svelte"
  import FancyForm from "./FancyForm.svelte"

  export let options = []
  export let selected = []
  export let showSelectAll = true
  export let selectAllText = "Select all"

  let allSelected = false
  $: {
    if (selected.length === options.length) {
      allSelected = true
    } else if (selected.length === 0) {
      allSelected = false
    } else {
      allSelected = "partial"
    }
  }

  function toggleSelectAll() {
    if (allSelected === true) {
      selected = []
    } else {
      selected = [...options]
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
      <FancyCheckbox bind:value={selected[i]} text={option} compress />
    {/each}
  </FancyForm>
{/if}

<style>
  .checkbox-item:hover {
    background-color: rgba(255, 255, 255, 0.01);
  }
</style>
