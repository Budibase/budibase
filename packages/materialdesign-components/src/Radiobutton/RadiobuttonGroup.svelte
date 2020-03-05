<script>
  import { onMount } from "svelte"
  import createItemStore from "../Common/ItemStore.js"
  import Radiobutton from "./Radiobutton.svelte"
  import Label from "../Common/Label.svelte"

  export let onChange = selected => {}

  export let _bb
  export let name = "radio-group"
  export let label = ""
  export let orientation = "row"
  export let fullwidth = false
  export let alignEnd = false
  export let disabled = false

  let selectedItemsStore
  let selected = null
  let radioItems

  onMount(() => {
    _bb.setContext("BBMD:input:context", "radiobuttongroup")
    selectedItemsStore = createItemStore(() => onChange($selectedItemsStore))
    _bb.setContext("BBMD:radiobutton:props", { name, disabled, alignEnd })
    _bb.setContext("BBMD:radiobutton:selectedItemsStore", selectedItemsStore)
  })

  $: alignRight = orientation === "column" && alignEnd
  $: radioItems && _bb.attachChildren(radioItems)
</script>

<div class="radiobutton-group">
  <div class="radiobutton-group__label">
    <Label text={label} bold />
  </div>
  <div class={`radiobutton-group__radios ${orientation}`} class:alignRight>
    <div bind:this={radioItems} class:fullwidth />
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
