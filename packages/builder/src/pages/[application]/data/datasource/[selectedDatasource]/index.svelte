<script>
  import { goto } from "@sveltech/routify"
  import { Button, Spacer, Icon, TextButton } from "@budibase/bbui"
  import { backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import IntegrationConfigForm from "components/backend/DatasourceNavigator/TableIntegrationMenu/IntegrationConfigForm.svelte"

  $: datasource = $backendUiStore.datasources.find(
    ds => ds._id === $backendUiStore.selectedDatasourceId
  )

  async function saveDatasource() {
    // Create datasource
    await backendUiStore.actions.datasources.save(datasource)
    notifier.success(`Datasource ${name} saved successfully.`)
  }
</script>

{#if datasource}
  <TextButton text small on:click={() => $goto('../new')}>
    <Icon name="filter" />
    Create Query
  </TextButton>
  <section>
    <h4>{datasource.name}: Configuration</h4>
    <IntegrationConfigForm integration={datasource.config} />
    <Spacer medium />
    <footer>
      <Button primary wide disabled={false} on:click={saveDatasource}>
        Save
      </Button>
    </footer>
  </section>
{/if}

<style>
  h4 {
    margin-top: var(--spacing-xl);
    margin-bottom: var(--spacing-s);
  }
  section {
    background: var(--background);
    border-radius: var(--border-radius-m);
    padding: var(--spacing-xl);
  }
</style>
