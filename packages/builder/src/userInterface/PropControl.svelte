<script>

import Checkbox from "../common/Checkbox.svelte";
import Textbox from "../common/Textbox.svelte";
import Dropdown from "../common/Dropdown.svelte";
import ComponentPropSelector from "./ComponentPropSelector.svelte";
import PropArraySelector from "./PropArraySelector.svelte";
import EventListSelector from "./EventListSelector.svelte";
import StateBindingControl from "./StateBindingControl.svelte";

export let errors = [];
export let setProp = () => {};
export let fieldHasError =() => {};
export let propDef = {};
export let props = {};
export let disabled;
export let index;
export let onEditComponent = () => {};

$: isOdd = (index % 2 !== 0);

const setComponentProp = (props) => {
    setProp(propDef.____name, props);
}

</script>


<div class="root" >

    {#if propDef.type === "component"}

    <div class="prop-label">{propDef.____name}</div>
    <ComponentPropSelector label={propDef.____name}
                            props={props[propDef.____name]}
                            {disabled}
                            onEdit={onEditComponent}
                            onComponentChosen={onEditComponent}
                            onValueChanged={setComponentProp}/>

    {:else if propDef.type === "array"}

    <div class="prop-label">{propDef.____name}</div>
    <PropArraySelector parentProps={props}
                       {propDef}
                       onValueChanged={setComponentProp}
                       onEditComponentProp={onEditComponent} />

    {:else if propDef.type === "event"}

    <div class="prop-label">{propDef.____name}</div>
    <EventListSelector parentProps={props}
                       {propDef}
                       onValueChanged={setComponentProp} />

    {:else}

    <div class="prop-label">{propDef.____name}</div>
    <StateBindingControl value={props[propDef.____name]}
                         type={propDef.type}
                         options={propDef.options}
                         onChanged={v => setProp(propDef.____name, v)}/>

    {/if} 

</div>

<style>

.root {
    padding: 1rem 1rem 0rem 1rem;
}

.prop-label {
    font-size: 0.8rem;
    color: var(--secondary100);
    font-weight: bold;
}

</style>