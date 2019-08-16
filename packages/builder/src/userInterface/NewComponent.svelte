<script>

import ComponentSearch from "./ComponentSearch.svelte";
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

import { 
    cloneDeep, 
    join,
    split,
    map,
    keys,
    isUndefined
} from "lodash/fp";
import { assign } from "lodash";



let modalElement;
let allComponents;

store.subscribe(s => {
    allComponents = s.allComponents;
})

export const close = () => {
    UIkit.modal(modalElement).hide();
}

export const show = () => {
    UIkit.modal(modalElement).show();
}

const onComponentChosen = (c) => {
    store.createDerivedComponent(c.name);
    close();
}

</script>

<div bind:this={modalElement} id="new-component-modal" uk-modal>
    <div class="uk-modal-dialog">

        <div class="uk-modal-header">
            <h1>New Component</h1>
        </div>

        <div class="uk-modal-body">
            <ComponentSearch onComponentChosen={onComponentChosen} />
        </div>
    </div>
</div>

<style>
h1 {
    font-size:1.2em;
}

</style>