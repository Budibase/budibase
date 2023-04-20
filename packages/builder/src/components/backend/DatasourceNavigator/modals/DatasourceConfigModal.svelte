<script>
  import { goto } from "@roxi/routify"
  import { ModalContent, notifications, Body, Layout } from "@budibase/bbui"
  import IntegrationConfigForm from "components/backend/DatasourceNavigator/TableIntegrationMenu/IntegrationConfigForm.svelte"
  import { IntegrationNames } from "constants/backend"
  import cloneDeep from "lodash/cloneDeepWith"
  import { saveDatasource as save } from "builderStore/datasource"
  import { onMount } from "svelte"
  import { _ } from "../../../../../lang/i18n"

  export let integration
  export let modal

  // kill the reference so the input isn't saved
  let datasource = cloneDeep(integration)
  let skipFetch = false
  let isValid = false

  $: name =
    IntegrationNames[datasource.type] || datasource.name || datasource.type

  async function saveDatasource() {
    try {
      if (!datasource.name) {
        datasource.name = name
      }
      const resp = await save(datasource, skipFetch)
      $goto(`./datasource/${resp._id}`)
      notifications.success(
        `${$_(
          "components.backend.DatasourceNavigation.modals.DatasourceConfigModal.Datasource_updated"
        )}`
      )
    } catch (err) {
      notifications.error(
        err?.message ??
          $_(
            "components.backend.DatasourceNavigation.modals.DatasourceConfigModal.Error_saving"
          )
      )
      // prevent the modal from closing
      return false
    }
  }

  onMount(() => {
    skipFetch = false
  })
</script>

<ModalContent
  title={`${$_(
    "components.backend.DatasourceNavigation.modals.DatasourceConfigModal.Connect_to"
  )} ${name}`}
  onConfirm={() => saveDatasource()}
  onCancel={() => modal.show()}
  confirmText={datasource.plus
    ? $_(
        "components.backend.DatasourceNavigation.modals.DatasourceConfigModal.tables"
      )
    : $_(
        "components.backend.DatasourceNavigation.modals.DatasourceConfigModal.query"
      )}
  cancelText={$_(
    "components.backend.DatasourceNavigation.modals.DatasourceConfigModal.Back"
  )}
  showSecondaryButton={datasource.plus}
  secondaryButtonText={datasource.plus
    ? $_(
        "components.backend.DatasourceNavigation.modals.DatasourceConfigModal.Skip"
      )
    : undefined}
  secondaryAction={() => {
    skipFetch = true
    saveDatasource()
    return true
  }}
  size="L"
  disabled={!isValid}
>
  <Layout noPadding>
    <Body size="XS"
      >{$_(
        "components.backend.DatasourceNavigation.modals.DatasourceConfigModal.Connect_database"
      )}
    </Body>
  </Layout>
  <IntegrationConfigForm
    schema={datasource.schema}
    bind:datasource
    creating={true}
    on:valid={e => (isValid = e.detail)}
  />
</ModalContent>
