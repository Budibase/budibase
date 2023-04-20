<script>
  import { _ } from "../../../../../../../../lang/i18n"
  import { Button, Heading, Body, Layout, Modal, Divider } from "@budibase/bbui"
  import CreateTableModal from "components/backend/TableNavigator/modals/CreateTableModal.svelte"
  import ICONS from "components/backend/DatasourceNavigator/icons"
  import { tables, datasources } from "stores/backend"
  import { goto } from "@roxi/routify"
  import { DEFAULT_BB_DATASOURCE_ID } from "constants/backend"
  import { onMount } from "svelte"

  let modal
  $: internalTablesBySourceId = $tables.list.filter(
    table =>
      table.type !== "external" && table.sourceId === DEFAULT_BB_DATASOURCE_ID
  )

  onMount(() => {
    datasources.select(DEFAULT_BB_DATASOURCE_ID)
  })
</script>

<Modal bind:this={modal}>
  <CreateTableModal />
</Modal>

<section>
  <Layout>
    <Layout gap="XS" noPadding>
      <header>
        <svelte:component this={ICONS.BUDIBASE} height="26" width="26" />
        <Heading size="M"
          >{$_(
            "pages.builder.app.application.data.datasource.datasource_internal_bb_default.index.Heading"
          )}</Heading
        >
      </header>
      <Body size="M">
        {$_(
          "pages.builder.app.application.data.datasource.datasource_internal_bb_default.index.A_tittle"
        )}
        <br />
        {$_(
          "pages.builder.app.application.data.datasource.datasource_internal_bb_default.index.If_you_have"
        )}
      </Body>
    </Layout>
    <Divider />
    <Heading size="S"
      >{$_(
        "pages.builder.app.application.data.datasource.datasource_internal_bb_default.index.Tables"
      )}</Heading
    >
    <div class="table-list">
      <!-- {JSON.stringify($tables.list.map(source => source.sourceId))} -->
      {#each internalTablesBySourceId as table}
        <div
          class="table-list-item"
          on:click={$goto(`../../table/${table._id}`)}
        >
          <Body size="S">{table.name}</Body>
          {#if table.primaryDisplay}
            <Body size="S"
              >{$_(
                "pages.builder.app.application.data.datasource.datasource_internal_bb_default.index.Display column:"
              )}
              {table.primaryDisplay}</Body
            >
          {/if}
        </div>
      {/each}
    </div>
    <div>
      <Button cta on:click={modal.show}
        >{$_(
          "pages.builder.app.application.data.datasource.datasource_internal_bb_default.index.Create_new_table"
        )}</Button
      >
    </div>
  </Layout>
</section>

<style>
  section {
    margin: 0 auto;
    width: 640px;
  }

  header {
    display: flex;
    gap: var(--spacing-l);
    align-items: center;
  }

  .table-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }

  .table-list-item {
    border-radius: var(--border-radius-m);
    background: var(--background);
    border: var(--border-dark);
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    padding: var(--spacing-m);
    gap: var(--layout-xs);
    transition: 200ms background ease;
  }

  .table-list-item:hover {
    background: var(--grey-1);
    cursor: pointer;
  }
</style>
