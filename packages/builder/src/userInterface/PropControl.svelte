<script>

import Checkbox from "../common/Checkbox.svelte";
import Textbox from "../common/Textbox.svelte";
import Dropdown from "../common/Dropdown.svelte";
import ComponentPropSelector from "./ComponentPropSelector.svelte";

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


    {#if propDef.type === "bool"}
    <Checkbox label={propDef.____name} 
                checked={props[propDef.____name]} 
                on:change={ev => setProp(propDef.____name, ev.target.checked)}
                hasError={fieldHasError(propDef.____name)} />
    {:else if propDef.type === "options"}
    <Dropdown label={propDef.____name}
                selected={props[propDef.____name]} 
                options={propDef.options}
                on:change={ev => setProp(propDef.____name, ev.target.value)}
                hasError={fieldHasError(propDef.____name)}/>
    {:else if propDef.type === "component"}
    <ComponentPropSelector label={propDef.____name}
                            props={props[propDef.____name]}
                            {disabled}
                            onEdit={onEditComponent}
                            onComponentChosen={onEditComponent}
                            onValueChanged={setComponentProp}/>
    {:else}
    <Textbox label={propDef.____name}
                text={props[propDef.____name]}
                on:change={ev => setProp(propDef.____name, ev.target.value)}
                margin={false}
                hasError={fieldHasError(propDef.____name)}
                {disabled}/>
    {/if} 

</div>

<style>

.root {
    padding: 3px 5px 7px 10px;
    border-style: dotted;
    border-width: 0 0 1px 0;
    border-color: var(--primary25);
}

</style>