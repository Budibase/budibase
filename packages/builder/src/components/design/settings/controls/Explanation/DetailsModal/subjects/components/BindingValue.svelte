<script>
import { decodeJSBinding } from "@budibase/string-templates"
import { getBindings } from "components/backend/DataTable/formula"
import { EditorModes } from "components/common/CodeEditor"
import CodeEditor from "components/common/CodeEditor/CodeEditor.svelte"
import { getDatasourceForProvider, runtimeToReadableBinding } from "dataBinding"
import { selectedComponent, selectedScreen, tables } from "stores/builder"

export let value
$: datasource = getDatasourceForProvider($selectedScreen, $selectedComponent)
$: tableId = datasource.tableId
$: table = $tables?.list?.find(table => table._id === tableId)
$: bindings = getBindings({ table })

$: readableBinding = runtimeToReadableBinding(bindings, value)

$: isJs = value?.startsWith?.("{{ js ")
</script>

<div class="editor">
  <CodeEditor
    readonly
    readonlyLineNumbers
    value={isJs ? decodeJSBinding(readableBinding) : readableBinding}
    jsBindingWrapping={isJs}
    mode={isJs ? EditorModes.JS : EditorModes.Handlebars}
  />
</div>

<style>
  .editor {
    border: 1px solid var(--grey-2);
    border-radius: 2px;
    overflow: hidden;
  }
</style>
