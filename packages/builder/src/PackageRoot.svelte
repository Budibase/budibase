<script>

import IconButton from "./common/IconButton.svelte";
import { store } from "./builderStore";
import UserInterfaceRoot from "./userInterface/UserInterfaceRoot.svelte";
import BackendRoot from "./BackendRoot.svelte";
import { fade } from "svelte/transition";

</script>

<div class="root">

    <div class="top-nav">
        <IconButton icon="home"/>
        <span class:active={$store.isBackend}
              on:click={store.showBackend}>
              Backend
        </span>
        <span class:active={!$store.isBackend}
              on:click={store.showFrontend}>
              Frontend
        </span>
    </div>

    <div class="content">
        {#if $store.isBackend}
        <div in:fade out:fade>
            <BackendRoot />
        </div>
        {:else}
        <div in:fade out:fade>
            <UserInterfaceRoot />
        </div>
        {/if}
    </div>

</div>

<style>

.root {
    height:100%;
    width:100%;
}

.top-nav {
    position:fixed;
    height:40px;
    margin: 0px;
    background: white;
    border-style:solid;
    border-width: 0px 0px 1px 0px;
    border-color: var(--lightslate);
    padding: 5px;
}

.content {
    position:fixed;
    height:calc(100% - 40px);
    top:40px;
    margin: 0px;
}

.content > div {
    height:100%;
    width:100%;
}

.active {
    color: var(--secondary100);
}

.top-nav > span {
    cursor: pointer;
    color: var(--slate);
    padding: 0px 15px;
}

.top-nav > span:hover {
    color: var(--secondary75);
}

</style>