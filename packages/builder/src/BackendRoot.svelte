<script>

import BackendNav from "./nav/BackendNav.svelte";
import Database from "./database/DatabaseRoot.svelte" ;
import UserInterface from "./userInterface/UserInterfaceRoot.svelte" ;
import ActionsAndTriggers from "./actionsAndTriggers/ActionsAndTriggersRoot.svelte" ;
import AccessLevels from "./accessLevels/AccessLevelsRoot.svelte" ;
import ComingSoon from "./common/ComingSoon.svelte";

import {store} from "./builderStore";

export let navWidth = "50px";


</script>

<div class="root">
  <div class="nav">
    <BackendNav />
  </div>
  <div class="content" 
       style="width: calc(100% - {navWidth}); left: {navWidth}"> 
    {#if $store.activeNav === "database"}
    <Database />
    {:else if $store.activeNav === "actions"}
    <ActionsAndTriggers />
    {:else if $store.activeNav === "access levels"}
    <AccessLevels />
    {/if}
  </div>
</div>



<style>
	.root {
    height: 100%;
    display: flex;
	}
  

  .content {
    flex: 1 1 auto;
    height: 100%;
    background-color: var(--white);
    margin:0;
  }

  .nav {
    flex: 0 1 auto;
    width: 300px;
    height: 100%;
  }

</style>