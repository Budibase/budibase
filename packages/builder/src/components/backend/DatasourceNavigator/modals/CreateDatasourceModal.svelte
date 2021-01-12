<script>
  import { goto, params } from "@sveltech/routify"
  import { backendUiStore, store } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import { Input, Label, ModalContent, Button, Spacer } from "@budibase/bbui"
  import TableIntegrationMenu from "../TableIntegrationMenu/index.svelte"
  import analytics from "analytics"

  let modal
  let error = ""

  let name
  let source
  let integration
  let datasource

  function checkValid(evt) {
    const datasourceName = evt.target.value
    if ($backendUiStore.datasources?.some(datasource => datasource.name === datasourceName)) {
      error = `Datasource with name ${datasourceName} already exists. Please choose another name.`
      return
    }
    error = ""
  }

  async function saveDatasource() {
    const { type, ...config } = integration

    // Create datasource
    const response = await backendUiStore.actions.datasources.save({
      name,
      source: type,
      config
    })
    notifier.success(`Datasource ${name} created successfully.`)
    analytics.captureEvent("Datasource Created", { name })

    console.log(response)

    // Navigate to new datasource
    $goto(`./datasource/${response._id}`)
  }
</script>

<ModalContent
  title="Create Datasource"
  confirmText="Create"
  onConfirm={saveDatasource}
  disabled={error || !name}>
  <Input
    data-cy="datasource-name-input"
    thin
    label="Datasource Name"
    on:input={checkValid}
    bind:value={name}
    {error} />
  <Label grey extraSmall>Source</Label>
  <TableIntegrationMenu bind:integration />
</ModalContent>
