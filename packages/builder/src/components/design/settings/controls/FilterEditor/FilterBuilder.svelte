<script>
  import ClientBindingPanel from "@/components/common/bindings/ClientBindingPanel.svelte"
  import { CoreFilterBuilder } from "@budibase/frontend-core"
  import { tables } from "@/stores/builder"
  import {
    runtimeToReadableBinding,
    readableToRuntimeBinding,
  } from "@/dataBinding"

  export let schemaFields = undefined
  export let filters = undefined
  export let bindings = []
  export let panel = ClientBindingPanel
  export let allowBindings = true
  export let allowOnEmpty = undefined
  export let datasource = undefined
  export let builderType = undefined
  export let docsURL = undefined
  export let evaluationContext = {}
  export let showGlobalHeader = true
  export let showGroupHeader = true
  export let showGroupActions = true
  export let showAddFilterAction = true
  export let showDeleteGroupAction = true
  export let showAddGroupButton = true
  export let groupBordered = true
  export let groupLabel = undefined
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
  {evaluationContext}
  {showGlobalHeader}
  {showGroupHeader}
  {showGroupActions}
  {showAddFilterAction}
  {showDeleteGroupAction}
  {showAddGroupButton}
  {groupBordered}
  {groupLabel}
  on:change
/>
