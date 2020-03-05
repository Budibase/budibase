<script>
  import { onMount } from "svelte"
  import Checkbox from "./Checkbox.svelte"
  import Label from "../Common/Label.svelte"
  import createItemsStore from "../Common/ItemStore.js"

  let selectedItemsStore
  let checkItems

  export let _bb
  export let label = ""
  export let orientation = "row"
  export let fullwidth = false
  export let onChange = selectedItems => {}

  export let disabled = false
  export let alignEnd = false
  let selectedItems = []

  onMount(() => {
    _bb.setContext("BBMD:input:context", "checkboxgroup")
    selectedItemsStore = createItemsStore(() => onChange($selectedItemsStore))
    _bb.setContext("BBMD:checkbox:selectedItemsStore", selectedItemsStore)
  })

  $: checkItems && _bb.attachChildren(checkItems)
</script>

<div class="checkbox-group">
  <div class="checkbox-group__label">
    <Label text={label} bold />
  </div>
  <div class={`checkbox-group__boxes ${orientation}`}>
    <div bind:this={checkItems} class:fullwidth />
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
