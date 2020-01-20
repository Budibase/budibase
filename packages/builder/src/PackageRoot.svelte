<script>

import IconButton from "./common/IconButton.svelte";
import { store } from "./builderStore";
import UserInterfaceRoot from "./userInterface/UserInterfaceRoot.svelte";
import BackendRoot from "./BackendRoot.svelte";
import { fade } from "svelte/transition";

</script>

<div class="root">

    <div class="top-nav">
        <button class="home-logo"><img src="/assets/budibase-logo-only.png"/></button>
        <!-- <IconButton icon="home"
                    color="var(--slate)"
                    hoverColor="var(--secondary75)"/> -->
        <span class:active={$store.isBackend}
              class="topnavitem"
              on:click={store.showBackend}>
              Backend
        </span>
        <span class:active={!$store.isBackend}
              class="topnavitem"
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
    display: flex;
    flex-direction: column;
}

.top-nav {
    flex: 0 0 auto;
    height: 48px;
    background: white;
    padding: 0px 15px;
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ddd;
}

.content {
    flex: 1 1 auto;
    width: 100%;
    height: 100px;
}

.content > div {
    height:100%;
    width:100%;
}

.topnavitem {
    cursor: pointer;
    color: var(--secondary50);
    margin: 0px 15px;
    padding-top: 4px;
    font-weight: 600;
    font-size: 1rem;
    height: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
}

.topnavitem:hover {
    color: var(--secondary75);
    font-weight: 600;

}

.active {
    color: var(--primary100);
    font-weight: 600;
    border-bottom: 2px solid var(--primary100);
    border-top: 2px solid transparent;
}

.home-logo {
    border-style: none;
    background-color: rgba(0,0,0,0);
    cursor: pointer;
    outline: none;
    height: 40px;
    padding: 8px 10px;
}

.home-logo:hover {
    color: var(--hovercolor);
}

.home-logo:active {
    outline:none;
}


.home-logo img {
    height: 100%;
}

</style>
