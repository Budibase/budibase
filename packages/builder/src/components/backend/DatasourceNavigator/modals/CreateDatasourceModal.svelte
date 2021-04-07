<script>
  import { goto } from "@roxi/routify"
  import { datasources } from "stores/backend"
  import { notifier } from "builderStore/store/notifications"
  import { Input, Label, ModalContent } from "@budibase/bbui"
  import TableIntegrationMenu from "../TableIntegrationMenu/index.svelte"
  import analytics from "analytics"

  let error = ""

  let name
  let integration

  function checkValid(evt) {
    const datasourceName = evt.target.value
    if (
      $datasources?.list.some(datasource => datasource.name === datasourceName)
    ) {
      error = `Datasource with name ${datasourceName} already exists. Please choose another name.`
      return
    }
    error = ""
  }

  async function saveDatasource() {
    const { type, ...config } = integration

    // Create datasource
    const response = await datasources.save({
      name,
      source: type,
      config,
    })
    notifier.success(`Datasource ${name} created successfully.`)
    analytics.captureEvent("Datasource Created", { name })

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
