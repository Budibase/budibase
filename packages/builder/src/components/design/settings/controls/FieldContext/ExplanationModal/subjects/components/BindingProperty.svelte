
<script>
  import {
    decodeJSBinding,
  } from "@budibase/string-templates"
  import CodeEditor from "components/common/CodeEditor/CodeEditor.svelte"
  import {
    EditorModes,
  } from "components/common/CodeEditor"
  import {
    readableToRuntimeBinding,
    runtimeToReadableBinding,
    getDatasourceForProvider
  } from "dataBinding"
  import { tables, datasources, selectedScreen, selectedComponent } from "stores/builder"
  import { getBindings } from "components/backend/DataTable/formula"

  export let value
  $: datasource = getDatasourceForProvider($selectedScreen, $selectedComponent)
  $: tableId = datasource.tableId
  $: table = $tables?.list?.find(table => table._id === tableId)
  $: bindings = getBindings({ table });

  $: readableBinding = runtimeToReadableBinding(bindings, value)

  $: isJs = value?.startsWith?.("{{ js ")
</script>

<CodeEditor
  readonly
  readonlyLineNumbers
  value={isJs ? decodeJSBinding(readableBinding) : readableBinding}
  jsBindingWrapping={isJs}
  mode={isJs ? EditorModes.JS :EditorModes.Handlebars}
/>

<style>
</style>
