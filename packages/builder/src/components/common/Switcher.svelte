<script>
  export let tabs = []
  export const selectTab = tabName => {
    selected = tabName
    selectedIndex = tabs.indexOf(selected)
  }

  let selected = tabs.length > 0 && tabs[0]
  let selectedIndex = 0

  const isSelected = tab => selected === tab
</script>

<div class="root">

  <div class="switcher">

    {#each tabs as tab}
      <button class:selected={selected === tab} on:click={() => selectTab(tab)}>
        {tab}
      </button>
    {/each}

  </div>

  <div class="panel">
    {#if selectedIndex === 0}
      <slot name="0" />
    {:else if selectedIndex === 1}
      <slot name="1" />
    {:else if selectedIndex === 2}
      <slot name="2" />
    {:else if selectedIndex === 3}
      <slot name="3" />
    {/if}
  </div>

</div>

<style>
  .root {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 20px 20px;
    border-left: solid 1px var(--grey-2);
    box-sizing: border-box;
  }

  .switcher {
    display: flex;
    margin: 0px 20px 20px 0px;
    box-sizing: border-box;
  }

  .switcher > button {
    display: inline-block;
    border: none;
    margin: 0;
    padding: 0;
    cursor: pointer;
    font-size: 18px;
    font-weight: 600;
    color: var(--grey-5);
    margin-right: 20px;
    background: none;
    outline: none;
  }

  .switcher > .selected {
    color: var(--ink);
  }

  .panel {
    min-height: 0;
    height: 100%;
    overflow-y: auto;
  }
</style>
