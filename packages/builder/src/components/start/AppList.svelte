<script>
  import { onMount } from "svelte"
  import AppCard from "./AppCard.svelte"
  import { apps } from "stores/portal"

  onMount(apps.load)
</script>

{#if $apps.length}
  <div class="appList">
    {#each $apps as app}
      <AppCard {...app} />
    {/each}
  </div>
{:else}
  <div>No apps</div>
{/if}

<style>
  .appList {
    display: grid;
    grid-gap: 50px;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
</style>
