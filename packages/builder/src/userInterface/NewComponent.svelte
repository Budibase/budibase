<script>

import ComponentSelector from "./ComponentSelector.svelte";
import { store } from "../builderStore";
import PropsView from "./PropsView.svelte";
import Textbox from "../common/Textbox.svelte";
import Button from "../common/Button.svelte";
import ButtonGroup from "../common/ButtonGroup.svelte";
import { pipe } from "../common/core";
import UIkit from "uikit";
import { isRootComponent } from "./pagesParsing/searchComponents";
import { splitName } from "./pagesParsing/splitRootComponentName.js"

import { 
    find, filter, some, map, includes
} from "lodash/fp";
import { assign } from "lodash";


export const show = () => {
    UIkit.modal(componentSelectorModal).show();
}

let componentSelectorModal;
let layoutComponents;
let layoutComponent;
let screens;
let name="";
let saveAttempted=false;

store.subscribe(s => {

    layoutComponents = pipe(s.components, [
        filter(c => c.container),
        map(c => ({name:c.name, ...splitName(c.name)}))
    ]);

    layoutComponent = layoutComponent 
                      ? find(c => c.name === layoutComponent.name)(layoutComponents)
                      : layoutComponents[0];

    screens = s.screens;
});

const save = () => {
    saveAttempted = true;

    const isValid = name.length > 0
                    && !screenNameExists(name)
                    && layoutComponent;
                    
    if(!isValid) return;

    store.createScreen(name, layoutComponent.name);
    UIkit.modal(componentSelectorModal).hide();
}

const cancel = () => {
    UIkit.modal(componentSelectorModal).hide();
}

const screenNameExists = (name) => 
    some(s => s.name.toLowerCase() === name.toLowerCase())(screens)

</script>

<div bind:this={componentSelectorModal} id="new-component-modal" uk-modal>
    <div class="uk-modal-dialog" uk-overflow-auto>

        <div class="uk-modal-header">
            <h1>New Screen</h1>
        </div>

        <div class="uk-modal-body uk-form-horizontal">
            <div class="uk-margin">
                <label class="uk-form-label">Name</label>
                <div class="uk-form-controls">
                    <input class="uk-input uk-form-small"
                        class:uk-form-danger={saveAttempted && (name.length === 0 || screenNameExists(name))}
                        bind:value={name} >
                </div>
            </div>

            <div class="uk-margin">
                <label class="uk-form-label">Layout Component</label>
                <div class="uk-form-controls">
                    <select class="uk-select uk-form-small" 
                            bind:value={layoutComponent}
                            class:uk-form-danger={saveAttempted && !layoutComponent}>
                        {#each layoutComponents as comp}
                        <option value={comp}>
                            {comp.componentName} - {comp.libName}
                        </option>
                        {/each}
                    </select>
                </div>
            </div>

            <ButtonGroup style="float: right;">
                <Button color="primary" grouped on:click={save}>Create Screen</Button>
                <Button color="tertiary" grouped on:click={cancel}>Cancel</Button>
            </ButtonGroup>
        </div>
    </div>
</div>



<style>
h1 {
    font-size:1.2em;
}

.component-option {
    border-style: solid;
    border-color: var(--slate);
    border-width: 0 0 1px 0;
    padding: 3px;
}

.component-option:hover {
    background-color: var(--lightslate);
}

.component-name {
    font-size: 11pt;
}

.lib-name {
    font-size: 9pt;
}

</style>