<script>

import {
    keys, map, some, includes,
    cloneDeep, isEqual, sortBy,
    filter, difference
} from "lodash/fp";
import { pipe } from "../common/core";
import { getInstanceProps } from "./pagesParsing/createProps";
import Checkbox from "../common/Checkbox.svelte";
import Textbox from "../common/Textbox.svelte";
import Dropdown from "../common/Dropdown.svelte";
import { validateProps } from "./pagesParsing/validateProps";
import PropControl from "./PropControl.svelte";
import IconButton from "../common/IconButton.svelte";

export let shouldValidate = true;
export let onValidate = () => {};
export let componentInfo;
export let instanceProps = null;
export let onPropsChanged = () => {};

let errors = [];
let props = {};
let propsDefinitions = [];
let isInstance = false;


$: {
    if(componentInfo)
    {
        isInstance = !!instanceProps;
        props = isInstance 
                ? getInstanceProps(componentInfo, instanceProps)
                : cloneDeep(componentInfo.fullProps);

        propsDefinitions = pipe(componentInfo.propsDefinition, [
                keys,
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
    errors = validateProps(componentInfo.rootComponent, finalProps, [], false);
    onValidate(errors);
    return errors.length === 0;
}

const fieldHasError = (propName) => 
    some(e => e.propName === propName)(errors);

</script>

<div class="root">

    <form class="uk-form-stacked form-root">
        {#each propsDefinitions as propDef, index}
        
        <div class="prop-container">

            <PropControl {setProp}
                        {fieldHasError}
                        {propDef}
                        {props}
                        {index}
                        disabled={false} />

        </div>
            
        {/each}

    </form>


    

</div>


<style>

.root {
    font-size:10pt;
    width: 100%;
}

.form-root {
    display: flex;
    flex-wrap: wrap;
}

.prop-container {
    flex: 1 1 auto;
    min-width: 250px;
}

</style>