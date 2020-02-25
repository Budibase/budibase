<script>
  import Checkbox from "./Checkbox.svelte"
  import Label from "../Common/Label.svelte"

  export let label = ""
  export let orientation = "row"
  export let fullwidth = false
  export let onChange = selectedItems => {}

  export let items = []

  export let disabled = false
  export let alignEnd = false
  let selectedItems = []

  function handleonChange(item) {
    if (!!item.checked) {
      item.checked = !item.checked
    } else {
      item.checked = true
    }
    onChange(items.filter(i => i.checked))
  }
</script>

<div class="checkbox-group">
  <div class="checkbox-group__label">
    <Label text={label} bold />
  </div>
  <div class={`checkbox-group__boxes ${orientation}`}>
    {#each items as item, i}
      <div class:fullwidth>
        <Checkbox
          id={`${item.label}-${i}`}
          {disabled}
          {alignEnd}
          indeterminate={item.indeterminate || false}
          label={item.label}
          checked={item.checked || false}
          onClick={() => handleonChange(item)} />
      </div>
    {/each}
  </div>
</div>

<style>
  .checkbox-group {
    display: flex;
    flex-direction: column;
  }

  .checkbox-group__boxes.row > div:not(:first-child) {
    padding-left: 10px;
  }

  .checkbox-group > div {
    text-align: left;
    flex: 1;
  }

  .row {
    display: flex;
    flex-flow: row wrap;
    align-items: flex-start;
  }

  .column {
    display: flex;
    flex-flow: column wrap;
    align-items: flex-start;
  }

  .fullwidth {
    flex: 1;
    text-align: left;
  }
</style>
