<script>
  import { isActive, goto } from "@roxi/routify"
  import { Icon, Modal, Tabs, Tab } from "@budibase/bbui"
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

  let selected = $isActive("./datasource") ? "External" : "Internal"

  function selectFirstTableOrSource({ detail }) {
    const { key } = tabs.find(t => t.title === detail)
    if (key === "datasource") {
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
    <Tabs {selected} on:select={selectFirstTableOrSource}>
      <Tab title="Internal">
        <div class="tab-content-padding">
          <TableNavigator />
          <Modal bind:this={modal}>
            <CreateTableModal />
          </Modal>
        </div>
      </Tab>
      <Tab title="External">
        <div class="tab-content-padding">
          <DatasourceNavigator />
          <Modal bind:this={modal}>
            <CreateDatasourceModal />
          </Modal>
        </div>
      </Tab>
    </Tabs>
    <div
      class="add-button"
      data-cy={`new-${selected === 'External' ? 'datasource' : 'table'}`}>
      <Icon hoverable name="AddCircle" on:click={modal.show} />
    </div>
  </div>
  <div class="content">
    <slot />
  </div>
</div>

<style>
  .root {
    flex: 1 1 auto;
    height: 0;
    display: grid;
    grid-template-columns: 260px minmax(0, 1fr);
  }

  .content {
    flex: 1 1 auto;
    padding: var(--spacing-l) 40px 40px 40px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-l);
  }
  .content :global(> span) {
    display: contents;
  }

  .tab-content-padding {
    padding: 0 var(--spacing-xl);
  }

  .nav {
    overflow-y: auto;
    background: var(--background);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    position: relative;
    border-right: var(--border-light);
    padding-bottom: 60px;
  }

  .add-button {
    position: absolute;
    top: var(--spacing-l);
    right: var(--spacing-xl);
  }
</style>
