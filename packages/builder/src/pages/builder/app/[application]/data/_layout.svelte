<script>
  import { Button, Layout } from "@budibase/bbui"
  import DatasourceNavigator from "components/backend/DatasourceNavigator/DatasourceNavigator.svelte"
  import CreateDatasourceModal from "components/backend/DatasourceNavigator/modals/CreateDatasourceModal.svelte"
  import Panel from "components/design/Panel.svelte"

  let modal
</script>

<!-- routify:options index=1 -->
<div class="data">
  <Panel title="Sources" borderRight>
    <Layout paddingX="L" paddingY="XL" gap="S">
      <Button cta on:click={modal.show}>Add source</Button>
      <CreateDatasourceModal bind:modal />
      <DatasourceNavigator />
    </Layout>
  </Panel>

  <div class="content">
    <slot />
  </div>
</div>

<style>
  .data {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    height: 0;
  }
  .content {
    padding: 28px 40px 40px 40px;
    overflow-y: auto;
    gap: var(--spacing-l);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    flex: 1 1 auto;
  }
</style>
