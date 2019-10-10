<script>

import ComponentSelector from "./ComponentSelector.svelte";
import { store } from "../builderStore";
import PropsView from "./PropsView.svelte";
import Textbox from "../common/Textbox.svelte";
import Button from "../common/Button.svelte";
import ButtonGroup from "../common/ButtonGroup.svelte";
import { pipe } from "../common/core";
import UIkit from "uikit";
import {
    getNewComponentInfo
} from "./pagesParsing/createProps";
import { isRootComponent } from "./pagesParsing/searchComponents";
import GeneratedComponents from "./GeneratedComponents.svelte";

import { 
    cloneDeep, 
    join,
    split,
    map,
    keys,
    isUndefined
} from "lodash/fp";
import { assign } from "lodash";



let componentSelectorModal;
let generatorOptionsModal;
let allComponents;
let generator;

store.subscribe(s => {
    allComponents = s.allComponents;
})

export const close = () => {
    UIkit.modal(componentSelectorModal).hide();
    if(generatorOptionsModal) UIkit.modal(generatorOptionsModal).hide();
    generator = null;
}

export const show = () => {
    UIkit.modal(componentSelectorModal).show();
}

const onComponentChosen = (c) => {
    store.createDerivedComponent(c.name);
    close();
}

const onGeneratorChosen = (g) => {
    generator = g;
    UIkit.modal(componentSelectorModal).hide();
    UIkit.modal(generatorOptionsModal).show();
}

const onConfirmGenerate = (components) => {
    store.createGeneratedComponents(components);
    UIkit.modal(generatorOptionsModal).hide();
    generator = null;
}

</script>

<div bind:this={componentSelectorModal} id="new-component-modal" uk-modal>
    <div class="uk-modal-dialog" uk-overflow-auto>

        <div class="uk-modal-header">
            <h1>New Component</h1>
        </div>

        <div class="uk-modal-body">
            <ComponentSelector onComponentChosen={onComponentChosen}
                               onGeneratorChosen={onGeneratorChosen}
                               allowGenerators={true} />
        </div>
    </div>
</div>


<div bind:this={generatorOptionsModal} uk-modal>
    <div class="uk-modal-dialog" uk-overflow-auto>

        {#if generator}
        
        <div class="uk-modal-header">
            <h1>Generator - {generator ? generator.name : ""}</h1>
        </div>

        <div class="uk-modal-body">
            <GeneratedComponents generator={generator}
                                 onConfirmGenerate={onConfirmGenerate} />
        </div>

        {/if}
    </div>
</div>


<style>
h1 {
    font-size:1.2em;
}

</style>