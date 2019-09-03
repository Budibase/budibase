<script>

import Textbox from "../common/Textbox.svelte";
import Dropdown from "../common/Dropdown.svelte";
import Button from "../common/Button.svelte";
import { store } from "../builderStore";
import { isRootComponent } from "./pagesParsing/searchComponents";
import {
    filter,
    find
} from "lodash/fp";

let entryComponent;
let title = "";
let components = [];

store.subscribe(s => {
    title = s.currentFrontEndItem.index.title;
    components = filter(s => !isRootComponent(s))(s.allComponents);
    entryComponent = find(c => c.name === s.currentFrontEndItem.appBody)(components);
});

const save = () => {
    const page = {
        index: {
            title
        },
        appBody: entryComponent.name,
    }
    store.savePage(page);
}

</script>

<div class="root">

    <h3>{$store.currentPageName}</h3>

    <form class="uk-form-horizontal">
        <Textbox bind:text={title} label="Title" />
        <div class="help-text">The title of your page, displayed in the bowser tab</div>
        <Dropdown label="App Entry Component"
                options={components}
                bind:selected={entryComponent}
                textMember={(v) => v.name} />

        <div class="help-text">The component that will be loaded into the body of the page</div>
        <div style="margin-top: 20px"></div>
        <Button on:click={save}>Save</Button>
    </form>

</div>

<style>
.root {
    padding: 15px;
}
.help-text {
    color: var(--slate);
    font-size: 10pt;
}
</style>