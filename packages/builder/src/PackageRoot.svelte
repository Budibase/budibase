<script>

import Nav from "./nav/Nav.svelte";
import Database from "./database/DatabaseRoot.svelte" ;
import UserInterface from "./userInterface/UserInterfaceRoot.svelte" ;
import ActionsAndTriggers from "./actionsAndTriggers/ActionsAndTriggersRoot.svelte" ;
import AccessLevels from "./accessLevels/AccessLevelsRoot.svelte" ;
import ComingSoon from "./common/ComingSoon.svelte";

import {store} from "./builderStore";

export let navWidth = "50px";


</script>

<div class="root">
  <Nav width={navWidth} />
  <div class="content" 
       style="width: calc(100% - {navWidth}); left: {navWidth}"> 
    {#if $store.activeNav === "database"}
    <Database />
    {:else if $store.activeNav === "actions"}
    <ActionsAndTriggers />
    {:else if $store.activeNav === "access levels"}
    <AccessLevels />
    {:else if $store.activeNav === "user interface"}
    <UserInterface />
    {/if}
  </div>
</div>



<style>
	.root {
    height: 100%;
	}
  

  .content {
    position: fixed;
    height: 100%;
    background-color: var(--white);
    margin:0;
  }


</style>