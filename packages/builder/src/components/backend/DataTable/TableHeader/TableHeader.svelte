<script>
  import ColumnHeaderPopover from "../popovers/ColumnPopover.svelte"

  export let column
  export let gridApi
  export let field
  export let enableMenu

  let menuButton

  // field = {
  //   name: column.colId,
  //   colDef: column.colDef,
  // }

  console.log("in svelte", $$restProps)

  function toggleMenu() {
    this.agParams.showColumnMenu(menuButton)
  }
</script>

<button bind:this={menuButton} on:click={toggleMenu} />
<ColumnHeaderPopover on:click {field} />

<style>
  h1 {
    color: rebeccapurple;
  }
</style>
