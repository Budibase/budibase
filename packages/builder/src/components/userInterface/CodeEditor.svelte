<script>
  import { store } from "builderStore"
  import UIkit from "uikit"
  import ActionButton from "components/common/ActionButton.svelte"
  import ButtonGroup from "components/common/ButtonGroup.svelte"
  import CodeMirror from "codemirror"
  import "codemirror/mode/javascript/javascript.js"

  export let onCodeChanged
  export let code

  export const show = () => {
    UIkit.modal(codeModal).show()
  }

  let codeModal
  let editor
  let cmInstance

  $: currentCode = code
  $: originalCode = code
  $: {
    if (editor) {
      if (!cmInstance) {
        cmInstance = CodeMirror.fromTextArea(editor, {
          mode: "javascript",
          lineNumbers: false,
          lineWrapping: true,
          smartIndent: true,
          matchBrackets: true,
          readOnly: false,
        })
        cmInstance.on("change", () => (currentCode = cmInstance.getValue()))
      }
      cmInstance.focus()
      cmInstance.setValue(code || "")
    }
  }

  const cancel = () => {
    UIkit.modal(codeModal).hide()
    currentCode = originalCode
  }

  const save = () => {
    originalCode = currentCode
    onCodeChanged(currentCode)
    UIkit.modal(codeModal).hide()
  }
</script>

<div bind:this={codeModal} uk-modal>
  <div class="uk-modal-dialog" uk-overflow-auto>

    <div class="uk-modal-header">
      <h3>Code</h3>
    </div>

    <div class="uk-modal-body uk-form-horizontal">

      <p>
        Use the code box below to control how this component is displayed, with
        javascript.
      </p>

      <div>
        <div class="editor-code-surround">
          function(render, context, state, route) {'{'}
        </div>
        <div class="editor">
          <textarea bind:this={editor} />
        </div>
        <div class="editor-code-surround">{'}'}</div>
      </div>
    </div>

    <div class="uk-modal-footer">
      <ButtonGroup>
        <ActionButton primary on:click={save}>Save</ActionButton>
        <ActionButton alert on:click={cancel}>Close</ActionButton>
      </ButtonGroup>
    </div>
  </div>
</div>

<style>
  h3 {
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 700;
    color: #8997ab;
    margin-bottom: 10px;
  }

  p {
    font-size: 12px;
    color: #333;
    margin-top: 0;
  }

  .editor {
    border-style: dotted;
    border-width: 1px;
    border-color: gainsboro;
    padding: 10px 30px;
  }

  .editor-code-surround {
    font-family: "Courier New", Courier, monospace;
  }
</style>
