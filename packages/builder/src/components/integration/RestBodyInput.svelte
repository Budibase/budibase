<script>
  import { Body } from "@budibase/bbui"
  import { RawRestBodyTypes } from "@/constants/backend"
  import KeyValueBuilder from "@/components/integration/KeyValueBuilder.svelte"
  import { EditorModes } from "@/components/common/CodeMirrorEditor.svelte"
  import { createEventDispatcher } from "svelte"
  import CodeEditor from "../common/CodeEditor/CodeEditor.svelte"

  const dispatch = createEventDispatcher()

  const objectTypes = [RawRestBodyTypes.FORM, RawRestBodyTypes.ENCODED]
  const textTypes = [
    RawRestBodyTypes.JSON,
    RawRestBodyTypes.XML,
    RawRestBodyTypes.TEXT,
  ]

  export let requestBody
  export let bodyType

  let text = ""
  let json = ""

  $: checkRequestBody(bodyType)
  $: updateRequestBody(bodyType, text, json)

  function checkRequestBody(type) {
    if (!bodyType || requestBody === undefined) {
      return
    }
    const currentType = typeof requestBody
    const isObject = objectTypes.includes(type)
    const isText = textTypes.includes(type)
    if (isText && currentType === "string") {
      text = requestBody
    } else if (isObject && currentType === "object") {
      json = requestBody
    }
  }

  function updateRequestBody(type, text, json) {
    if (requestBody === undefined) {
      return
    }

    if (type === RawRestBodyTypes.NONE) {
      if (requestBody != null) {
        dispatch("change", { requestBody: null })
      }
      return
    }

    if (objectTypes.includes(type)) {
      if (requestBody !== json) {
        dispatch("change", { requestBody: json })
      }
      return
    }

    if (requestBody !== text) {
      dispatch("change", { requestBody: text })
    }
  }
</script>

<div class="margin">
  {#if bodyType === RawRestBodyTypes.NONE}
    <div class="none">
      <Body size="S" weight="800">THE REQUEST DOES NOT HAVE A BODY</Body>
    </div>
  {:else if objectTypes.includes(bodyType)}
    <KeyValueBuilder bind:object={json} name="param" headings />
  {:else if textTypes.includes(bodyType)}
    <div class="embed">
      {#key bodyType}
        <CodeEditor
          value={text}
          mode={EditorModes.Handlebars}
          aiEnabled={false}
          on:change={e => dispatch("change", { requestBody: e.detail })}
        />
      {/key}
    </div>
  {/if}
</div>

<style>
  .embed :global(.cm-editor) {
    min-height: 200px;
    border: 1px solid var(--spectrum-global-color-gray-400);
    border-radius: 4px;
  }
  .embed :global(.cm-gutters) {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .margin {
    margin-top: var(--spacing-m);
  }
  .none {
    display: flex;
    justify-content: center;
  }
</style>
