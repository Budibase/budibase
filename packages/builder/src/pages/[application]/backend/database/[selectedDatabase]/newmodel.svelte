<script>
  import { FIELDS } from "constants/backend";
  import Block from "./Block.svelte";
</script>

<section>
  <header>
    <h2>Create New Table</h2>
    <span>Before you can view your table, you need to set it up.</span>
  </header>

  <div class="block-row">
    <h4>Fields</h4>
    <div class="blocks">
      {#each Object.values(FIELDS) as field}
        <Block primary title={field.name} icon={field.icon} />
      {/each}
    </div>
  </div>

  <!-- TODO: More block rows -->

</section>

<style>
  h2 {
    font-size: 20px;
    font-weight: bold;
  }

  .block-row {
    margin-top: 40px;
  }

  .block-row .blocks {
    display: grid;
    grid-auto-flow: column;
    grid-gap: 10px;
  }
</style>