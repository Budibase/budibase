<script>

import Checkbox from "../common/Checkbox.svelte";
import Textbox from "../common/Textbox.svelte";
import Dropdown from "../common/Dropdown.svelte";
import EventListSelector from "./EventListSelector.svelte";
import StateBindingControl from "./StateBindingControl.svelte";

export let errors = [];
export let setProp = () => {};
export let fieldHasError =() => {};
export let propDef = {};
export let props = {};
export let disabled;
export let index;

$: isOdd = (index % 2 !== 0);

const setComponentProp = (props) => {
    setProp(propDef.____name, props);
}

</script>


<div class="root" >

    {#if propDef.type === "event"}

    <h5>{propDef.____name}</h5>
    <EventListSelector parentProps={props}
                       {propDef}
                       onValueChanged={setComponentProp} />

    {:else }

    <h5>{propDef.____name}</h5>
    <StateBindingControl value={props[propDef.____name]}
                         type={propDef.type}
                         options={propDef.options}
                         onChanged={v => setProp(propDef.____name, v)}/>

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
