<script>
  import AppCard from "./AppCard.svelte"
  import { apps } from "stores/portal"

  export let exportApp
</script>

{#if $apps.length}
  <div class="appList">
    {#each $apps as app}
      <AppCard {exportApp} {app} />
    {/each}
  </div>
{/if}

<style>
  .appList {
    display: grid;
    grid-gap: 50px;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
</style>
