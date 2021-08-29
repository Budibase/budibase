<script>
  import { datasources } from "stores/backend"
  import { notifications } from "@budibase/bbui"
  import { Input, ModalContent, Modal } from "@budibase/bbui"
  import analytics from "analytics"
  import { _ as t } from "svelte-i18n"

  let error = ""
  let modal
  let name

  export let datasource
  export let onCancel = undefined

  export const show = () => {
    name = datasource?.name
    modal.show()
  }
  export const hide = () => {
    modal.hide()
  }

  function checkValid(evt) {
    const datasourceName = evt.target.value
    if ($datasources?.list.some(ds => ds.name === datasourceName)) {
      error =
        $t("datasource-with-name") +
        ` ${datasourceName} ` +
        $t("already-exists-please-choose-another-name")
      return
    }
    error = ""
  }

  async function updateDatasource() {
    const updatedDatasource = {
      ...datasource,
      name,
    }
    await datasources.save(updatedDatasource)
    notifications.success(
      $t("datasource") + ` ${name} ` + $t("updated-successfully") + `.`
    )
    analytics.captureEvent("Datasource Updated", updatedDatasource)
    hide()
  }
</script>

<Modal bind:this={modal} on:hide={onCancel}>
  <ModalContent
    title={$t("edit-datasource")}
    size="L"
    confirmText={$t("save")}
    onConfirm={updateDatasource}
    disabled={error || !name || !datasource?.type}
  >
    <Input
      data-cy="datasource-name-input"
      label={$t("datasource-name")}
      on:input={checkValid}
      bind:value={name}
      {error}
    />
  </ModalContent>
</Modal>
