<script>
  import AppCard from "./AppCard.svelte"
  export let apps
</script>

<div class="root">
  <div class="inner">
    <div>
      <div>
        <div class="apps">
          {#each apps as app}
            <AppCard {...app} />
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .apps {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    grid-gap: var(--layout-m);
    justify-content: start;
  }

  .root {
    margin: 20px 80px;
  }
</style>
