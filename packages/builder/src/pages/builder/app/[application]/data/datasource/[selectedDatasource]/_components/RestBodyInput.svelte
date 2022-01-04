<script>
  import { Body } from "@budibase/bbui"
  import { RawRestBodyTypes } from "constants/backend"
  import KeyValueBuilder from "components/integration/KeyValueBuilder.svelte"
  import CodeMirrorEditor, {
    EditorModes,
  } from "components/common/CodeMirrorEditor.svelte"

  const objectTypes = [RawRestBodyTypes.FORM, RawRestBodyTypes.ENCODED]
  const textTypes = [
    RawRestBodyTypes.JSON,
    RawRestBodyTypes.XML,
    RawRestBodyTypes.TEXT,
  ]

  export let query
  export let bodyType

  $: checkRequestBody(bodyType)

  function checkRequestBody(type) {
    if (!bodyType || !query) {
      return
    }
    const currentType = typeof query?.fields.requestBody
    if (objectTypes.includes(type) && currentType !== "object") {
      query.fields.requestBody = {}
    } else if (textTypes.includes(type) && currentType !== "string") {
      query.fields.requestBody = ""
    }
  }

  function editorMode(type) {
    switch (type) {
      case RawRestBodyTypes.JSON:
        return EditorModes.JSON
      case RawRestBodyTypes.XML:
        return EditorModes.XML
      default:
      case RawRestBodyTypes.TEXT:
        return EditorModes.Text
    }
  }
</script>

<div class="margin">
  {#if bodyType === RawRestBodyTypes.NONE}
    <div class="none">
      <Body size="S" weight="800">THE REQUEST DOES NOT HAVE A BODY</Body>
    </div>
  {:else if objectTypes.includes(bodyType)}
    <KeyValueBuilder
      bind:object={query.fields.requestBody}
      name="param"
      headings
    />
  {:else if textTypes.includes(bodyType)}
    <CodeMirrorEditor
      height={200}
      mode={editorMode(bodyType)}
      value={query.fields.requestBody}
      resize="vertical"
      on:change={e => (query.fields.requestBody = e.detail)}
    />
  {/if}
</div>

<style>
  .margin {
    margin-top: var(--spacing-m);
  }
  .none {
    display: flex;
    justify-content: center;
  }
</style>
