<script lang="ts">
  import { InlineAlert, Link, Input, notifications } from "@budibase/bbui"
  import {
    appStore,
    datasources,
    queries,
    screenStore,
    tables,
    views,
    viewsV2,
  } from "@/stores/builder"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import { SourceType } from "@budibase/types"
  import { goto, params } from "@roxi/routify"
  import { DB_TYPE_EXTERNAL } from "@/constants/backend"
  import { get } from "svelte/store"
  import type { Table, ViewV2, View, Datasource, Query } from "@budibase/types"

  export let source: Table | ViewV2 | Datasource | Query | undefined

  let confirmDeleteDialog: any
  let affectedScreens: { text: string; url: string }[] = []
  let sourceType: SourceType | undefined = undefined
  let viewsMessage: string = ""
  let deleteSourceName: string | undefined

  const getViewsMessage = () => {
    if (!source || !("views" in source)) {
      return ""
    }
    const views = Object.values(source?.views ?? [])
    if (views.length < 1) {
      return ""
    }
    if (views.length === 1) {
      return ", including 1 view"
    }

    return `, including ${views.length} views`
  }

  function getSourceID(): string {
    if (!source) {
      throw new Error("No data source provided.")
    }
    if ("id" in source) {
      return source.id
    }
    return source._id!
  }

  export const show = async () => {
    viewsMessage = getViewsMessage()
    const usage = await screenStore.usageOfScreens(getSourceID())
    affectedScreens = processScreens(usage.screens)
    sourceType = usage.sourceType
    confirmDeleteDialog.show()
  }

  function processScreens(
    screens: { url: string; _id: string }[]
  ): { text: string; url: string }[] {
    return screens.map(({ url, _id }) => ({
      text: url,
      url: `/builder/app/${$appStore.appId}/design/${_id}`,
    }))
  }

  function hideDeleteDialog() {
    deleteSourceName = ""
  }

  const autofillSourceName = () => {
    deleteSourceName = source?.name
  }

  async function deleteTable(table: Table & { datasourceId?: string }) {
    const isSelected = $params.tableId === table._id
    try {
      await tables.delete({
        _id: table._id!,
        _rev: table._rev!,
      })

      if (table.sourceType === DB_TYPE_EXTERNAL) {
        await datasources.fetch()
      }
      notifications.success("Table deleted")
      if (isSelected) {
        $goto(`./datasource/${table.datasourceId}`)
      }
    } catch (error: any) {
      notifications.error(`Error deleting table - ${error.message}`)
    }
  }

  async function deleteView(view: ViewV2 | View) {
    try {
      if ("version" in view && view.version === 2) {
        await viewsV2.delete(view as ViewV2)
      } else {
        await views.delete(view as View)
      }
      notifications.success("View deleted")
    } catch (error) {
      console.error(error)
      notifications.error("Error deleting view")
    }
  }

  async function deleteDatasource(datasource: Datasource) {
    try {
      const isSelected =
        get(datasources).selectedDatasourceId === datasource._id
      await datasources.delete(datasource)
      notifications.success("Datasource deleted")
      if (isSelected) {
        $goto("./datasource")
      }
    } catch (error) {
      notifications.error("Error deleting datasource")
    }
  }

  async function deleteQuery(query: Query) {
    try {
      // Go back to the datasource if we are deleting the active query
      if ($queries.selectedQueryId === query._id) {
        $goto(`./datasource/${query.datasourceId}`)
      }
      await queries.delete(query)
      await datasources.fetch()
      notifications.success("Query deleted")
    } catch (error) {
      notifications.error("Error deleting query")
    }
  }

  async function deleteSource() {
    if (!source || !sourceType) {
      throw new Error("Unable to delete - no data source found.")
    }

    switch (sourceType) {
      case SourceType.TABLE:
        return await deleteTable(source as Table)
      case SourceType.VIEW:
        return await deleteView(source as ViewV2)
      case SourceType.QUERY:
        return await deleteQuery(source as Query)
      case SourceType.DATASOURCE:
        return await deleteDatasource(source as Datasource)
    }
  }
</script>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText={`Delete ${sourceType}`}
  onOk={deleteSource}
  onCancel={hideDeleteDialog}
  title="Confirm Deletion"
  disabled={deleteSourceName !== source?.name}
>
  <div class="content">
    <p class="firstWarning">
      Are you sure you wish to delete the {sourceType}
      <span class="sourceNameLine">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <b on:click={autofillSourceName} class="sourceName">{source?.name}</b>
        <span>?</span>
      </span>
    </p>

    <p class="secondWarning">
      All {sourceType} data will be deleted{viewsMessage}.
    </p>
    <p class="thirdWarning">This action <b>cannot be undone</b>.</p>

    {#if affectedScreens.length > 0}
      <div class="affectedScreens">
        <InlineAlert
          header={`The following screens use this ${sourceType} and may no longer function as expected`}
        >
          <ul class="affectedScreensList">
            {#each affectedScreens as item}
              <li>
                <Link quiet overBackground target="_blank" href={item.url}
                  >{item.text}</Link
                >
              </li>
            {/each}
          </ul>
        </InlineAlert>
      </div>
    {/if}
    <p class="fourthWarning">
      Please enter "<b on:click={autofillSourceName} class="sourceName"
        >{source?.name}</b
      >" below to confirm.
    </p>
    <Input bind:value={deleteSourceName} placeholder={source?.name} />
  </div>
</ConfirmDialog>

<style>
  .content {
    margin-top: 0;
    max-width: 320px;
  }

  .firstWarning {
    margin: 0 0 12px;
    max-width: 100%;
  }

  .sourceNameLine {
    display: inline-flex;
    max-width: 100%;
    vertical-align: bottom;
  }

  .sourceName {
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }

  .secondWarning {
    margin: 0;
    max-width: 100%;
  }

  .thirdWarning {
    margin: 0 0 12px;
    max-width: 100%;
  }

  .affectedScreens {
    margin: 18px 0;
    max-width: 100%;
    margin-bottom: 24px;
  }

  .affectedScreens :global(.spectrum-InLineAlert) {
    max-width: 100%;
  }

  .affectedScreensList {
    padding: 0;
    margin-bottom: 0;
  }

  .affectedScreensList li {
    display: block;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 4px;
  }

  .fourthWarning {
    margin: 12px 0 6px;
    max-width: 100%;
  }
</style>
