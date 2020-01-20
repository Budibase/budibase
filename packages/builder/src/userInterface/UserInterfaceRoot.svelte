<script>

import ComponentsHierarchy from "./ComponentsHierarchy.svelte";
import PagesList from "./PagesList.svelte"
import { store } from "../builderStore";
import getIcon from "../common/icon";
import { isComponent } from "./pagesParsing/searchComponents";
import IconButton from "../common/IconButton.svelte";
import Modal from "../common/Modal.svelte";
import NewComponent from "./NewComponent.svelte";
import CurrentItemPreview from "./CurrentItemPreview.svelte";
import SettingsView from "./SettingsView.svelte";
import PageView from "./PageView.svelte";
import ComponentsPaneSwitcher from "./ComponentsPaneSwitcher.svelte";

let newComponentPicker;
const newComponent = () => {
    newComponentPicker.show();
}

let settingsView;
const settings = () => {
    settingsView.show();
}

</script>

<div class="root">

    <div class="ui-nav">

        <div class="pages-list-container">
            <div class="nav-group-header">

                <span class="navigator-title">Navigator</span>
            </div>
            <div class="nav-items-container">
                <PagesList />
            </div>
        </div>

        <div class="components-list-container">
            <div class="nav-group-header">

                <span class="components-nav-header">Screens</span>
                <div>
                    <!-- <IconButton icon="settings"
                                size="14px"
                                on:click={settings}/> -->
                    <!-- <IconButton icon="plus"
                                on:click={newComponent}/> -->
                    <button on:click={newComponent}>+</button>
                </div>
            </div>
            <div class="nav-items-container">
                <ComponentsHierarchy components={$store.screens}/>
            </div>
        </div>

    </div>

    <div class="preview-pane">
        {#if $store.currentFrontEndType === "screen"}
        <CurrentItemPreview />
        {:else if $store.currentFrontEndType === "page"}
        <PageView />
        {/if}
    </div>

    {#if $store.currentFrontEndType === "screen"}
    <div class="components-pane">
        <ComponentsPaneSwitcher />
    </div>
    {/if}

</div>


<NewComponent bind:this={newComponentPicker}/>
<SettingsView bind:this={settingsView} />


<style>
button {
    cursor: pointer;
    outline: none;
    border: none;
    border-radius: 5px;
    background: var(--background-button);

    width: 1.8rem;
    height: 1.8rem;
    padding-bottom: 10px;

    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 1.2rem;
    font-weight: 700;
    color: var(--button-text);
}

.root {
    display: grid;
    grid-template-columns: 290px 1fr 300px;
    height: 100%;
    width: 100%;
    background: #fafafa;
}

.ui-nav {
    grid-column: 1;
    background-color: var(--secondary5);
    height: 100%;
    padding: 0 1.5rem 0rem 1.5rem
}

.preview-pane {
    grid-column: 2;
    margin: 80px 60px;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 0px 6px rgba(0,0,0,0.05)
}

.components-pane {
    grid-column: 3;
    background-color: var(--secondary5);
    min-height: 0px;
    overflow-y: hidden;
}

.components-nav-header {
    font-size: 0.75rem;
    color: #999;
    text-transform: uppercase;
}

.nav-group-header {
    font-size: .9rem;
    padding-left: 1rem;
}

.nav-items-container {
    padding: 1rem 0rem 0rem 0rem;
}

.nav-group-header {
    display: flex;
    padding: 2rem 0 0 0;
    font-size: .9rem;
    font-weight: bold;
    justify-content: space-between;
    align-items: center;
}

.nav-group-header>div:nth-child(1) {
    padding: 0rem .5rem 0rem 0rem;
    vertical-align: bottom;
    grid-column-start: icon;
    margin-right: 5px;
}

.nav-group-header>span:nth-child(2) {
    margin-left:5px;
    vertical-align: bottom;
    grid-column-start: title;
    margin-top:auto;
}

.nav-group-header>div:nth-child(3) {
    vertical-align: bottom;
    grid-column-start: button;
    cursor: pointer;
    color: var(--primary75);
}

.nav-group-header>div:nth-child(3):hover {
    color: var(--primary75);
}

.navigator-title {
    text-transform: uppercase;
    font-weight: 400;
    color: #999;
}

</style>
