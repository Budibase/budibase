<script>
  import ClientBindingPanel from "@/components/common/bindings/ClientBindingPanel.svelte"
  import { CoreFilterBuilder } from "@budibase/frontend-core"
  import { tables } from "@/stores/builder"
  import {
    runtimeToReadableBinding,
    readableToRuntimeBinding,
  } from "@/dataBinding"

  export let schemaFields
  export let filters
  export let bindings = []
  export let panel = ClientBindingPanel
  export let allowBindings = true
  export let allowOnEmpty
  export let datasource
  export let builderType
  export let docsURL
</script>

<CoreFilterBuilder
  toReadable={runtimeToReadableBinding}
  toRuntime={readableToRuntimeBinding}
  behaviourFilters={true}
  tables={$tables.list}
  {filters}
  {panel}
  {schemaFields}
  {datasource}
  {allowBindings}
  {bindings}
  {allowOnEmpty}
  {builderType}
  {docsURL}
  on:change
/>
