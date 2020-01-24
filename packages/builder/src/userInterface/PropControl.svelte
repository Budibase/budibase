<script>

import Checkbox from "../common/Checkbox.svelte";
import Textbox from "../common/Textbox.svelte";
import Dropdown from "../common/Dropdown.svelte";
import EventListSelector from "./EventListSelector.svelte";
import StateBindingControl from "./StateBindingControl.svelte";

export let setProp = () => {};
export let disabled;
export let index;
export let prop_name;
export let prop_value;
export let prop_type = {};

$: isOdd = (index % 2 !== 0);

const setComponentProp = (props) => {
    setProp(propDef.____name, props);
}

</script>


<div class="root" >

    {#if prop_type === "event"}

    <!-- <h5>{prop_name}</h5>
    <EventListSelector parentProps={props}
                       {propDef}
                       onValueChanged={setComponentProp} /> -->

    {:else }

    <h5>{prop_name}</h5>
    <StateBindingControl value={prop_value}
                         type={prop_type}
                         options={prop_type.options}
                         onChanged={v => setProp(prop_name, v)}/>

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
}

h5 {
    font-size: 12px;
    font-weight: 700;
    color: #163057;
    opacity: 0.6;
    padding-top: 12px;
    margin-bottom: 0;
  }

</style>
