<script>
  import { ActionButton } from "@budibase/bbui"
  import KeyValueBuilder from "@/components/integration/KeyValueBuilder.svelte"
  import {
    getRestBindings,
    readableToRuntimeBinding,
    runtimeToReadableMap,
  } from "@/dataBinding"
  import { cloneDeep, isEqual } from "lodash/fp"
  import Panel from "./Panel.svelte"

  export let datasource
  export let updatedDatasource
  export let markDirty
  let restBindings = getRestBindings()
  let addHeader

  // Use parent-provided updatedDatasource when available
  $: localUpdatedDatasource = updatedDatasource ?? cloneDeep(datasource)
  $: parsedHeaders = runtimeToReadableMap(
    restBindings,
    localUpdatedDatasource?.config?.defaultHeaders
  )

  const onDefaultHeaderUpdate = headers => {
    const flatHeaders = cloneDeep(headers).reduce((acc, entry) => {
      const name = (entry?.name ?? "").toString().trim()
      const valueRaw = entry?.value
      const valueStr = valueRaw?.toString?.() || ""
      const value = valueStr.trim()

      if (name !== "" || value !== "") {
        acc[name] = readableToRuntimeBinding(restBindings, entry.value)
      }
      return acc
    }, {})

    const prev = localUpdatedDatasource.config.defaultHeaders || {}
    if (!isEqual(prev, flatHeaders)) {
      localUpdatedDatasource.config.defaultHeaders = flatHeaders
      markDirty && markDirty()
    }
  }
</script>

<Panel>
  <KeyValueBuilder
    bind:this={addHeader}
    object={parsedHeaders}
    on:change={evt => onDefaultHeaderUpdate(evt.detail)}
    noAddButton
    bindings={restBindings}
  />
  <div>
    <ActionButton icon="plus" on:click={() => addHeader.addEntry()}>
      Add header
    </ActionButton>
  </div>
</Panel>
