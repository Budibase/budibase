<script>

import PropsView from "./PropsView.svelte";
import IconButton from "../common/IconButton.svelte";
import { getComponentInfo } from "./pagesParsing/createProps";
import { store } from "../builderStore";
import { 
    cloneDeep,
    isUndefined
} from "lodash/fp";
import { fade, slide } from 'svelte/transition';

export let propertyName = "";
export let onGoBack = () => {};
export let instanceProps = {};
export let onPropsChanged = () => {};


let editingSubComponentName;
let editingSubComponentProps;
let allComponents;

store.subscribe(s => {
    allComponents = s.allComponents;
})

$: componentInfo = getComponentInfo(
    allComponents, instanceProps._component);

const onSubComponentGoBack = () => {
    editingSubComponentName = null;
    editingSubComponentProps = null;
}

const onEditComponentProp = (propName, arrayIndex, arrayPropName) => {
    editingSubComponentName = isUndefined(arrayIndex)
                              ? propName
                              : `${propName}[${arrayIndex}].${arrayPropName}`;
    editingSubComponentProps = isUndefined(arrayIndex)
                               ? instanceProps[propName]
                               : instanceProps[propName][arrayIndex][arrayPropName];
};


const onSubComponentPropsChanged = (subProps) => {
    const newProps = cloneDeep(instanceProps);
    newProps[editingSubComponentName] = subProps;
    instanceProps = newProps;
    onPropsChanged(newProps);
}


const propsChanged = newProps => {
    instanceProps = newProps;
    onPropsChanged(newProps);
}

</script>

<div>

    <div class="title">
        <IconButton icon="chevron-left"
                    on:click={onGoBack}/>
        <span>{propertyName}</span>
    </div>

    {#if editingSubComponentName}
    <div in:slide={{delay: 250, duration: 300}}
         out:fade>
        <svelte:self onPropsChanged={onSubComponentPropsChanged}
                    onGoBack={onSubComponentGoBack}
                    instanceProps={editingSubComponentProps}
                    propertyName={editingSubComponentName} />
    </div>
    {:else}
    <PropsView {instanceProps}
               {componentInfo}
               onPropsChanged={propsChanged}
               {onEditComponentProp} />
    {/if}
    

     

</div>

<style>
.title {
    padding:3px;
    background-color: white;
    color: var(--secondary100);
    border-style:solid;
    border-width: 1px 0 0 0;
    border-color: var(--lightslate);
}

.title > span {
    margin-left: 10px;
 }
</style>