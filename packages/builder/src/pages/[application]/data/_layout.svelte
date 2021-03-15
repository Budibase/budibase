<script>
  import { isActive, goto } from "@sveltech/routify"
  import { Switcher, Modal } from "@budibase/bbui"
  import TableNavigator from "components/backend/TableNavigator/TableNavigator.svelte"
  import DatasourceNavigator from "components/backend/DatasourceNavigator/DatasourceNavigator.svelte"
  import CreateDatasourceModal from "components/backend/DatasourceNavigator/modals/CreateDatasourceModal.svelte"
  import CreateTableModal from "components/backend/TableNavigator/modals/CreateTableModal.svelte"

  const tabs = [
    {
      title: "Internal",
      key: "table",
    },
    {
      title: "External",
      key: "datasource",
    },
  ]

  let tab = $isActive('./datasource') ? "datasource" : "table"

  function selectFirstTableOrSource({ detail }) {
    const type = detail.heading.key
    if (type === 'datasource') {
      $goto("./datasource")
    } else {
      $goto("./table")
    }
  }

  let modal
</script>

<!-- routify:options index=0 -->
<div class="root">
  <div class="nav">
    <Switcher headings={tabs} bind:value={tab} on:change={selectFirstTableOrSource}>
      <div class="title">
        <i
          data-cy={`new-${tab}`}
          class="ri-add-circle-fill"
          on:click={modal.show} />
      </div>
      {#if tab === 'table'}
        <TableNavigator />
        <Modal bind:this={modal}>
          <CreateTableModal />
        </Modal>
      {:else if tab === 'datasource'}
        <DatasourceNavigator />
        <Modal bind:this={modal}>
          <CreateDatasourceModal />
        </Modal>
      {/if}
    </Switcher>
  </div>
  <div class="content">
    <slot />
  </div>
</div>

<style>
  .root {
    height: calc(100vh - 60px);
    display: grid;
    grid-template-columns: 260px minmax(0, 1fr);
    background: var(--grey-2);
  }

  .content {
    flex: 1 1 auto;
    padding: var(--spacing-l) 40px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-l);
    background: var(--background);
  }

  .nav {
    overflow-y: auto;
    background: var(--background);
    padding: var(--spacing-l) var(--spacing-xl);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-l);
    position: relative;
    border-right: 1px solid var(--grey-2);
  }

  i {
    font-size: 20px;
    position: absolute;
    top: var(--spacing-l);
    right: var(--spacing-xl);
  }

  i:hover {
    cursor: pointer;
    color: var(--blue);
  }
</style>
