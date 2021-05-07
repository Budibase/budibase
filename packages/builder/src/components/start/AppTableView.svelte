<script>
  import AppCard from "./AppCard.svelte"
  import { apps } from "stores/portal"
  import { Table } from "@budibase/bbui"
</script>

{#if $apps.length}
  <div class="appList">
    {#each $apps as app}
      <AppCard {...app} />
    {/each}
  </div>
{:else}
  <div>No apps found.</div>
{/if}

<style>
  .appList {
    display: grid;
    grid-gap: 50px;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
</style>
