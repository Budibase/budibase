<script>
  import { ActionButton } from "@budibase/bbui"
  import KeyValueBuilder from "components/integration/KeyValueBuilder.svelte"
  import {
    getRestBindings,
    readableToRuntimeBinding,
    runtimeToReadableMap,
  } from "builderStore/dataBinding"
  import { cloneDeep } from "lodash/fp"
  import SaveDatasourceButton from "./SaveDatasourceButton.svelte"
  import Panel from "./Panel.svelte"
  import Tooltip from "./Tooltip.svelte"

  export let datasource
  let restBindings = getRestBindings()
  let addHeader

  $: updatedDatasource = cloneDeep(datasource)
  $: parsedHeaders = runtimeToReadableMap(
    restBindings,
    updatedDatasource?.config?.defaultHeaders
  )

  const onDefaultHeaderUpdate = headers => {
    const flatHeaders = cloneDeep(headers).reduce((acc, entry) => {
      acc[entry.name] = readableToRuntimeBinding(restBindings, entry.value)
      return acc
    }, {})

    updatedDatasource.config.defaultHeaders = flatHeaders
  }
</script>

<Panel>
  <SaveDatasourceButton slot="controls" {datasource} {updatedDatasource} />
  <Tooltip
    slot="tooltip"
    title="REST Headers"
    href="https://docs.budibase.com/docs/rest-queries#headers"
  />
  <KeyValueBuilder
    bind:this={addHeader}
    object={parsedHeaders}
    on:change={evt => onDefaultHeaderUpdate(evt.detail)}
    noAddButton
    bindings={restBindings}
  />
  <div>
    <ActionButton icon="Add" on:click={() => addHeader.addEntry()}>
      Add header
    </ActionButton>
  </div>
</Panel>
