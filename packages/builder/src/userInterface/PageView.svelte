<script>

import Textbox from "../common/Textbox.svelte";
import Dropdown from "../common/Dropdown.svelte";
import Button from "../common/Button.svelte";
import { store } from "../builderStore";
import { isRootComponent } from "./pagesParsing/searchComponents";

let entryComponent;
let title = "";
let components = [];

store.subscribe(s => {
    title = s.currentFrontEndItem.title;
    entryComponent = s.currentFrontEndItem.entryComponent;
    components = filter(s => !isRootComponent(s))(s.allComponents);
});

const save = () => {
    const page = {
        title,
        entryComponent,
    }
    store.savePage(page);
}

</script>

<p>{$store.currentPageName}</p>

<form class="uk-form-horizontal">
    <Textbox bind:value={title} label="Title" />
    <Dropdown bind:value={title} 
              label="App Entry Component"
              options={components}
              selected={entryComponent}
              textMember="name" />

    <Button on:click={save}>Save</Button>
</form>

<style>

</style>