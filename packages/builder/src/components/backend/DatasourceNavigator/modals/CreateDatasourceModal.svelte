<script>
  import { goto } from "@roxi/routify"
  import { datasources } from "stores/backend"
  import { notifications } from "@budibase/bbui"
  import { Input, Label, ModalContent, Modal, Context } from "@budibase/bbui"
  import TableIntegrationMenu from "../TableIntegrationMenu/index.svelte"
  import CreateTableModal from "components/backend/TableNavigator/modals/CreateTableModal.svelte"
  import analytics from "analytics"
  import { getContext } from "svelte"
  import { _ as t } from "svelte-i18n"

  const modalContext = getContext(Context.Modal)

  let tableModal
  let name
  let error = ""
  let integration

  $: checkOpenModal(integration && integration.type === "BUDIBASE")

  function checkValid(evt) {
    const datasourceName = evt.target.value
    if (
      $datasources?.list.some(datasource => datasource.name === datasourceName)
    ) {
      error = $t('datasource-with-name') + ` ${datasourceName} ` + $t('already-exists-please-choose-another-name')
      return
    }
    error = ""
  }

  function checkOpenModal(isInternal) {
    if (isInternal) {
      tableModal.show()
    }
  }

  async function saveDatasource() {
    const { type, plus, ...config } = integration

    // Create datasource
    const response = await datasources.save({
      name,
      source: type,
      config,
      plus,
    })
    notifications.success($t('datasource') + ` ${name} ${$t('created-successfully')}.`)
    analytics.captureEvent("Datasource Created", { name, type })

    // Navigate to new datasource
    $goto(`./datasource/${response._id}`)
  }
</script>

<Modal bind:this={tableModal} on:hide={modalContext.hide}>
  <CreateTableModal bind:name />
</Modal>
<ModalContent
  title={ $t('create-datasource') }
  size="L"
  confirmText={ $t('create') }
  onConfirm={saveDatasource}
  disabled={error || !name || !integration?.type}
>
  <Input
    data-cy="datasource-name-input"
    label={ $t('datasource-name') }
    on:input={checkValid}
    bind:value={name}
    {error}
  />
  <Label>{ $t('datasource-type') }</Label>
  <TableIntegrationMenu bind:integration />
</ModalContent>
