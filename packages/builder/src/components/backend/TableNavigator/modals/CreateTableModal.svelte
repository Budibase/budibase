<script>
  import { goto, url } from "@roxi/routify"
  import { store } from "builderStore"
  import { tables } from "stores/backend"
  import { notifications } from "@budibase/bbui"
  import {
    Input,
    Label,
    ModalContent,
    Toggle,
    Divider,
    Layout,
  } from "@budibase/bbui"
  import TableDataImport from "../TableDataImport.svelte"
  import analytics from "analytics"
  import screenTemplates from "builderStore/store/screenTemplates"
  import { buildAutoColumn, getAutoColumnInformation } from "builderStore/utils"
  import { NEW_ROW_TEMPLATE } from "builderStore/store/screenTemplates/newRowScreen"
  import { ROW_DETAIL_TEMPLATE } from "builderStore/store/screenTemplates/rowDetailScreen"
  import { ROW_LIST_TEMPLATE } from "builderStore/store/screenTemplates/rowListScreen"
  import { _ as t } from "svelte-i18n"

  const defaultScreens = [
    NEW_ROW_TEMPLATE,
    ROW_DETAIL_TEMPLATE,
    ROW_LIST_TEMPLATE,
  ]

  $: tableNames = $tables.list.map(table => table.name)

  export let name
  let dataImport
  let error = ""
  let createAutoscreens = true
  let autoColumns = getAutoColumnInformation()

  function addAutoColumns(tableName, schema) {
    for (let [subtype, col] of Object.entries(autoColumns)) {
      if (!col.enabled) {
        continue
      }
      schema[col.name] = buildAutoColumn(tableName, col.name, subtype)
    }
    return schema
  }

  function checkValid(evt) {
    const tableName = evt.target.value
    if (tableNames.includes(tableName)) {
      error =
        $t("table-with-name") +
        ` ${tableName} ` +
        $t("already-exists-please-choose-another-name")
      return
    }
    error = ""
  }

  async function saveTable() {
    let newTable = {
      name,
      schema: addAutoColumns(name, dataImport.schema || {}),
      dataImport,
    }

    // Only set primary display if defined
    if (dataImport.primaryDisplay && dataImport.primaryDisplay.length) {
      newTable.primaryDisplay = dataImport.primaryDisplay
    }

    // Create table
    const table = await tables.save(newTable)
    notifications.success(
      $t("table") + ` ${name} ${$t("created-successfully")}.`
    )
    analytics.captureEvent("Table Created", { name })

    // Create auto screens
    if (createAutoscreens) {
      const screens = screenTemplates($store, [table])
        .filter(template => defaultScreens.includes(template.id))
        .map(template => template.create())
      for (let screen of screens) {
        // Record the table that created this screen so we can link it later
        screen.autoTableId = table._id
        await store.actions.screens.create(screen)
      }

      // Create autolink to newly created list screen
      const listScreen = screens.find(screen =>
        screen.props._instanceName.endsWith("List")
      )
      await store.actions.components.links.save(
        listScreen.routing.route,
        table.name
      )
    }

    // Navigate to new table
    const currentUrl = $url()
    const path = currentUrl.endsWith("data")
      ? `./table/${table._id}`
      : `../../table/${table._id}`
    $goto(path)
  }
</script>

<ModalContent
  title={$t("create-table")}
  confirmText={$t("create")}
  onConfirm={saveTable}
  disabled={error || !name || (dataImport && !dataImport.valid)}
>
  <Input
    data-cy="table-name-input"
    thin
    label={$t("table-name")}
    on:input={checkValid}
    bind:value={name}
    {error}
  />
  <div class="autocolumns">
    <Label extraSmall grey>{$t("auto-columns")}</Label>
    <div class="toggles">
      <div class="toggle-1">
        <Toggle
          text={$t("created-by")}
          bind:value={autoColumns.createdBy.enabled}
        />
        <Toggle
          text={$t("created-at")}
          bind:value={autoColumns.createdAt.enabled}
        />
        <Toggle text={$t("auto-id")} bind:value={autoColumns.autoID.enabled} />
      </div>
      <div class="toggle-2">
        <Toggle
          text={$t("updated-by")}
          bind:value={autoColumns.updatedBy.enabled}
        />
        <Toggle
          text={$t("updated-at")}
          bind:value={autoColumns.updatedAt.enabled}
        />
      </div>
    </div>
    <Divider />
  </div>
  <Toggle
    text={$t("generate-screens-in-design-section")}
    bind:value={createAutoscreens}
  />
  <div>
    <Layout gap="XS" noPadding>
      <Label grey extraSmall>{$t("create-table-from-csv-optional")}</Label>
      <TableDataImport bind:dataImport />
    </Layout>
  </div>
</ModalContent>

<style>
  .autocolumns {
    margin-bottom: -10px;
  }

  .toggles {
    display: flex;
    width: 100%;
    margin-top: 6px;
  }

  .toggle-1 :global(> *) {
    margin-bottom: 10px;
  }

  .toggle-2 :global(> *) {
    margin-bottom: 10px;
    margin-left: 20px;
  }
</style>
