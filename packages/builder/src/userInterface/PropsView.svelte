<script>

import {
    keys,
    map,
    some,
    includes,
    cloneDeep,
    isEqual,
    sortBy,
    filter,
    difference
} from "lodash/fp";
import { pipe } from "../common/core";
import { 
    getComponentInfo ,
    getInstanceProps
} from "./pagesParsing/createProps";
import { getExactComponent } from "./pagesParsing/searchComponents";
import Checkbox from "../common/Checkbox.svelte";
import Textbox from "../common/Textbox.svelte";
import Dropdown from "../common/Dropdown.svelte";
import { validateProps } from "./pagesParsing/validateProps";
import ComponentPropSelector from "./ComponentPropSelector.svelte";
import PropControl from "./PropControl.svelte";
import IconButton from "../common/IconButton.svelte";

export let shouldValidate = true;
export let onValidate = () => {};
export let componentInfo;
export let instanceProps = null;
export let onPropsChanged = () => {};
export let onEditComponentProp = () => {};

let errors = [];
let props = {};
let propsDefinitions = [];
let inheritedPropsDefinitions = [];
let inheritedExpanded = false;
let isInstance = false;

const isPropInherited = name => 
    includes(name)(componentInfo.inheritedProps);

$: {
    if(componentInfo)
    {
        isInstance = !!instanceProps;
        props = isInstance 
                ? getInstanceProps(componentInfo, instanceProps)
                : cloneDeep(componentInfo.fullProps);

        propsDefinitions = pipe(componentInfo.propsDefinition, [
                keys,
                filter(k => !isPropInherited(k)),
                map(k => ({...componentInfo.propsDefinition[k], ____name:k})),
                sortBy("____name")
            ]);

        inheritedPropsDefinitions = pipe(componentInfo.propsDefinition, [
                keys,
                filter(k => isPropInherited(k)),
                map(k => ({...componentInfo.propsDefinition[k], ____name:k})),
                sortBy("____name")
            ]);
    }
}


let setProp = (name, value) => {
    const newProps = cloneDeep(props);

    let finalProps = isInstance ? newProps : cloneDeep(componentInfo.component.props);

    if(!isInstance) {
        const nowSet = [];
        for(let p of componentInfo.unsetProps) {
            if(!isEqual(newProps[p])(componentInfo.rootDefaultProps[p])) {
                finalProps[p] = newProps[p];
                nowSet.push(p);
            }
        }
        componentInfo.unsetProps = difference(nowSet)(componentInfo.unsetProps);
    }

    newProps[name] = value;
    finalProps[name] = value;
    props = newProps;
    if(validate(finalProps))
        onPropsChanged(finalProps);
    
}
                  
const validate = (finalProps) => {
    errors = validateProps(componentInfo.propsDefinition, finalProps, [], false);
    onValidate(errors);
    return errors.length === 0;
}

const fieldHasError = (propName) => 
    some(e => e.propName === propName)(errors);

const onEditComponent = (propName) => (arrayIndex, arrayPropName) => {
    onEditComponentProp(propName, arrayIndex, arrayPropName);
}

</script>

<div class="root">

    <form class="uk-form-stacked">
        {#each propsDefinitions as propDef, index}
        
        <PropControl {setProp}
                     {fieldHasError}
                     {propDef}
                     {props}
                     {index}
                     onEditComponent={onEditComponent(propDef.____name)}
                     disabled={false} />
            
        {/each}

        {#if inheritedPropsDefinitions.length > 0}
        <div class="inherited-title padding">
            <div>Inherited</div>
            <div>
                <IconButton icon={inheritedExpanded ? "chevron-down" : "chevron-right"}
                            on:click={() => inheritedExpanded = !inheritedExpanded}/>
            </div>
        </div>
        {/if}

        {#if inheritedExpanded}
            {#each inheritedPropsDefinitions as propDef, index}
            
            <PropControl {setProp}
                         {fieldHasError}
                         {propDef}
                         {props}
                         {index}
                         disabled={true} />
                
            {/each}
        {/if}
    </form>


    

</div>


<style>

.root {
    font-size:10pt;
}

.padding {
    padding: 0 10px;
}

.inherited-title {
    padding: 1rem 1rem 1rem 1rem;
    display: grid;
    grid-template-columns: [name] 1fr [actions] auto;
    color: var(--secondary100);
    font-size: .9rem;
    font-weight: bold;
}

.inherited-title > div:nth-child(1) {
    grid-column-start: name;
    color: var(--secondary50);
}

.inherited-title > div:nth-child(2) {
    grid-column-start: actions;
    color: var(--secondary100);
}

</style>