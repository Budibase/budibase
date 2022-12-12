<script>
  import { redirect } from "@roxi/routify"
  import { Button, Tabs, Tab, Layout } from "@budibase/bbui"
  import DatasourceNavigator from "components/backend/DatasourceNavigator/DatasourceNavigator.svelte"
  import CreateDatasourceModal from "components/backend/DatasourceNavigator/modals/CreateDatasourceModal.svelte"

  let selected = "Sources"

  let modal

  function selectFirstDatasource() {
    $redirect("./table")
  }
</script>

<!-- routify:options index=1 -->
<div class="root">
  <div class="nav">
    <Tabs {selected} on:select={selectFirstDatasource}>
      <Tab title="Sources">
        <Layout paddingX="L" paddingY="L" gap="S">
          <Button dataCy={`new-datasource`} cta wide on:click={modal.show}
            >Add source</Button
          >
        </Layout>
        <CreateDatasourceModal bind:modal />
        <DatasourceNavigator />
      </Tab>
    </Tabs>
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
