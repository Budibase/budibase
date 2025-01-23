<script lang="ts">
  import ClientBindingPanel from "@/components/common/bindings/ClientBindingPanel.svelte"
  import { CoreFilterBuilder } from "@budibase/frontend-core"
  import { tables } from "@/stores/builder"
  import {
    runtimeToReadableBinding,
    readableToRuntimeBinding,
  } from "@/dataBinding"

  export let schemaFields
  export let filters
  export let bindings: any[] = []
  export let panel = ClientBindingPanel
  export let allowBindings = true
  export let allowOnEmpty = true
  export let datasource
  export let builderType: "builder" | "filter" = "filter"
  export let docsURL: string | undefined = undefined
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
