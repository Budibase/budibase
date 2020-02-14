<script>
  import Radiobutton from "./Radiobutton.svelte"
  import Label from "../Common/Label.svelte"

  export let name = "radio-group"
  export let label = ""
  export let orientation = "row"
  export let fullwidth = false
  export let alignEnd = false

  export let onChange = selected => {}

  export let items = []

  let selected = null

  $: alignRight = orientation === "column" && alignEnd

  function handleOnClick(item) {
    if (!!selected) selected.checked = false
    item.checked = true
    selected = item
    items = items
    onChange(selected)
  }
</script>

<div class="radiobutton-group">
  <div class="radiobutton-group__label">
    <Label text={label} bold />
  </div>
  <div class={`radiobutton-group__radios ${orientation}`} class:alignRight>
    {#each items as item, i}
      <div class:fullwidth>
        <Radiobutton
          id={`${item.label}-${i}`}
          {name}
          {alignEnd}
          label={item.label}
          checked={item.checked}
          onClick={() => handleOnClick(item)} />
      </div>
    {/each}
  </div>
</div>

<style>
  .radiobutton-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .radiobutton-group__radios.row > div:not(:first-child) {
    padding-left: 10px;
  }

  .radiobutton-group > div {
    flex: 1;
  }

  .alignRight {
    text-align: right;
  }

  .row {
    display: flex;
    flex-flow: row wrap;
  }

  .column {
    display: flex;
    flex-flow: column wrap;
  }

  .fullwidth {
    flex: 1;
    text-align: left;
  }
</style>
