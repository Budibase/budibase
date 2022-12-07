<script>
  import { database, queries } from "stores/backend"
  import QueryInterface from "components/integration/QueryViewer.svelte"
</script>

<section>
  <div class="inner">
    {#if $database._id}
      <QueryInterface query={$queries.selected} />
    {/if}
  </div>
</section>

<style>
  .inner {
    width: 640px;
    margin: 0 auto;
  }
</style>
