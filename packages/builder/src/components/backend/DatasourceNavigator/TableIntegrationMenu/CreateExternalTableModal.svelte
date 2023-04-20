<script>
  import { ModalContent, Body, Input, notifications } from "@budibase/bbui"
  import { tables, datasources } from "stores/backend"
  import { goto } from "@roxi/routify"
  import { _ } from "../../../../../lang/i18n"

  export let datasource

  let name = ""
  let submitted = false
  $: valid = name && name.length > 0 && !datasource?.entities?.[name]
  $: error =
    !submitted && name && datasource?.entities?.[name]
      ? $_(
          "components.backend.DatasourceNavigation.TableIntegrationMenu.CreateExternalTableModal.Table_name"
        )
      : null

  function buildDefaultTable(tableName, datasourceId) {
    return {
      name: tableName,
      type: "external",
      primary: ["id"],
      sourceId: datasourceId,
      schema: {
        id: {
          autocolumn: true,
          type: "number",
        },
      },
    }
  }

  async function saveTable() {
    try {
      submitted = true
      const table = await tables.save(buildDefaultTable(name, datasource._id))
      await datasources.fetch()
      $goto(`../../table/${table._id}`)
    } catch (error) {
      notifications.error(
        `${$_(
          "components.backend.DatasourceNavigation.TableIntegrationMenu.CreateExternalTableModal.Error_saving"
        )} - ${
          error?.message ||
          $_(
            "components.backend.DatasourceNavigation.TableIntegrationMenu.CreateExternalTableModal.unknown error"
          )
        }`
      )
    }
  }
</script>

<ModalContent
  title={$_(
    "components.backend.DatasourceNavigation.TableIntegrationMenu.CreateExternalTableModal.Create_table"
  )}
  confirmText={$_(
    "components.backend.DatasourceNavigation.TableIntegrationMenu.CreateExternalTableModal.Create"
  )}
  onConfirm={saveTable}
  disabled={!valid}
>
  <Body
    >{$_(
      "components.backend.DatasourceNavigation.TableIntegrationMenu.CreateExternalTableModal.Provide_name"
    )}</Body
  >
  <Input
    label={$_(
      "components.backend.DatasourceNavigation.TableIntegrationMenu.CreateExternalTableModal.Table Name"
    )}
    bind:error
    bind:value={name}
  />
</ModalContent>
