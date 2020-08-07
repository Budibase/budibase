<script>
  import { backendUiStore } from "builderStore"
  import { uuid } from "builderStore/uuid"
  import { fade } from "svelte/transition"
  import { notifier } from "builderStore/store/notifications"
  import { FIELDS, BLOCKS } from "constants/backend"
  import Block from "components/common/Block.svelte"

  function addNewField(field) {
    backendUiStore.actions.models.addField(field)
  }

  function createModel(model) {
    const { schema, ...rest } = $backendUiStore.selectedModel

    backendUiStore.actions.models.save({
      model: {
        ...model,
        ...rest,
      },
    })
    notifier.success(`${model.name} table created.`)
  }
</script>

<section transition:fade>
  <header>
    <h2>Create New Table</h2>
    <p>Before you can view your table, you need to set it up.</p>
  </header>

  <div class="block-row">
    <span class="block-row-title">Fields</span>
    <p>Blocks are pre-made fields and help you build your table quicker.</p>
    <div class="blocks">
      {#each Object.values(FIELDS) as field}
        <Block
          primary
          title={field.name}
          icon={field.icon}
          on:click={() => addNewField(field)} />
      {/each}
    </div>
  </div>

  <div class="block-row">
    <span class="block-row-title">Blocks</span>
    <p>Blocks are pre-made fields and help you build your table quicker.</p>
    <div class="blocks">
      {#each Object.values(BLOCKS) as field}
        <Block
          secondary
          title={field.name}
          icon={field.icon}
          on:click={() => addNewField(field)} />
      {/each}
    </div>
  </div>
</section>

<style>
  section {
    height: 100vh;
  }

  h2 {
    font-size: 20px;
    font-weight: bold;
    margin: 0;
  }

  .block-row-title {
    font-weight: 500;
    font-size: 16px;
  }

  p {
    margin-top: 8px;
    margin-bottom: 20px;
    font-size: 14px;
  }

  .block-row {
    margin-top: 40px;
  }

  .block-row .blocks {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 110px;
    grid-gap: 20px;
  }
</style>
