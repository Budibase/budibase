<script>
  import { store } from "builderStore";
  import Checkbox from "../common/Checkbox.svelte"
  import Textbox from "../common/Textbox.svelte"
  import Dropdown from "../common/Dropdown.svelte"
  import StateBindingControl from "./StateBindingControl.svelte"

  export let index
  export let prop_name
  export let prop_value
  export let prop_definition = {}
</script>

<div class="root">
  {#if prop_definition.type !== 'event'}
    <h5>{prop_name}</h5>
    <StateBindingControl
      value={prop_value}
      type={prop_definition.type || prop_definition}
      options={prop_definition.options}
      styleBindingProperty={prop_definition.styleBindingProperty}
      onChanged={v => store.setComponentProp(prop_name, v)} />
  {/if}
</div>

<style>
  .root {
    height: 40px;
    margin-bottom: 15px;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 70px 1fr;
    grid-gap: 10px;
    align-items: baseline;
  }

  h5 {
    word-wrap: break-word;
    font-size: 13px;
    font-weight: 400;
    color: #000333;
    opacity: 0.8;
    padding-top: 13px;
    margin-bottom: 0;
  }
</style>
