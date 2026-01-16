<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte"
  import toJsonSchema from "to-json-schema"
  import Ajv from "ajv"
  import type { JSONSchema7 } from "json-schema"
  import {
    ActionButton,
    Modal,
    ModalContent,
    Tabs,
    Tab,
    Body,
    Icon,
  } from "@budibase/bbui"
  import { helpers } from "@budibase/shared-core"
  import CodeEditor from "@/components/common/CodeEditor/CodeEditor.svelte"
  import { EditorModes } from "@/components/common/CodeEditor"

  type JSONSchema = JSONSchema7

  export let value: JSONSchema | Record<string, unknown> = {}

  const ajv = new Ajv()
  const dispatch = createEventDispatcher()

  let modal: Modal
  let activeTab = "From Sample"

  // Sample tab state
  let sampleJson = ""
  let sampleError = ""
  let generatedSchema: JSONSchema | null = null

  // Schema tab state
  let schemaJson = ""
  let schemaError = ""
  let validationErrors: string[] = []

  // Preview state
  let previewSchema: JSONSchema | null = null

  function initializeFromValue() {
    if (value && Object.keys(value).length > 0) {
      schemaJson = JSON.stringify(value, null, 2)
      previewSchema = value as JSONSchema
    }
  }

  function sampleToJsonSchema(sample: unknown): JSONSchema {
    const rawSchema = toJsonSchema(sample) as Record<string, unknown>
    return helpers.structuredOutput.normalizeSchemaForStructuredOutput(
      rawSchema
    ) as JSONSchema
  }

  function validateJsonSchema(schema: unknown): {
    valid: boolean
    errors: string[]
  } {
    if (typeof schema !== "object" || schema === null) {
      return { valid: false, errors: ["Schema must be an object"] }
    }

    const valid = ajv.validateSchema(schema as object)
    if (valid) {
      return { valid: true, errors: [] }
    }

    const errors = (ajv.errors || []).map(err => {
      const path = err.schemaPath || "Root"
      return `${path}: ${err.message}`
    })

    return { valid: false, errors }
  }

  function onSampleChange(newValue: string) {
    sampleJson = newValue
    sampleError = ""
    generatedSchema = null

    if (!sampleJson.trim()) {
      previewSchema = null
      return
    }

    try {
      const parsed = JSON.parse(sampleJson)
      generatedSchema = sampleToJsonSchema(parsed)
      previewSchema = generatedSchema
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      sampleError = `Invalid JSON: ${errorMessage}`
      previewSchema = null
    }
  }

  function onSchemaChange(newValue: string) {
    schemaJson = newValue
    schemaError = ""
    validationErrors = []

    if (!schemaJson.trim()) {
      previewSchema = null
      return
    }

    try {
      const parsed = JSON.parse(schemaJson)
      const validation = validateJsonSchema(parsed)
      if (!validation.valid) {
        validationErrors = validation.errors
        previewSchema = null
      } else {
        // Show the normalized schema in preview
        previewSchema =
          helpers.structuredOutput.normalizeSchemaForStructuredOutput(
            parsed as Record<string, unknown>
          ) as JSONSchema
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      schemaError = `Invalid JSON: ${errorMessage}`
      previewSchema = null
    }
  }

  function handleTabChange(e: CustomEvent<string>) {
    activeTab = e.detail
    previewSchema = null
    sampleError = ""
    schemaError = ""
    validationErrors = []

    if (activeTab === "JSON Schema" && schemaJson.trim()) {
      onSchemaChange(schemaJson)
    } else if (activeTab === "From Sample" && sampleJson.trim()) {
      onSampleChange(sampleJson)
    }
  }

  function saveSchema() {
    let schema: JSONSchema | null = null

    if (activeTab === "From Sample") {
      schema = generatedSchema
    } else {
      try {
        const parsed = JSON.parse(schemaJson)
        // Normalize user-provided schemas for provider compatibility
        schema = helpers.structuredOutput.normalizeSchemaForStructuredOutput(
          parsed as Record<string, unknown>
        ) as JSONSchema
      } catch {
        return
      }
    }

    if (schema) {
      dispatch("change", schema)
      modal.hide()
    }
  }

  function isValid(schema: JSONSchema | null): boolean {
    if (activeTab === "From Sample") {
      return schema !== null && !sampleError
    }
    return (
      schemaJson.trim() !== "" && !schemaError && validationErrors.length === 0
    )
  }

  function openModal() {
    initializeFromValue()
    if (value && Object.keys(value).length > 0) {
      activeTab = "JSON Schema"
    } else {
      activeTab = "From Sample"
    }
    modal.show()
  }

  onMount(() => {
    initializeFromValue()
  })
</script>

<ActionButton on:click={openModal}>Define output schema</ActionButton>

<Modal bind:this={modal}>
  <ModalContent
    title="Structured output schema"
    confirmText="Save schema"
    onConfirm={saveSchema}
    disabled={!isValid(generatedSchema)}
    size="L"
  >
    <div class="schema-editor">
      <Tabs noPadding quiet selected={activeTab} on:select={handleTabChange}>
        <Tab title="From Sample">
          <div class="tab-content">
            <div class="input-section">
              <div class="section-header">
                <span class="section-icon">
                  <Icon name="list" size="S" />
                </span>
                <Body size="S">Paste sample JSON data</Body>
              </div>
              <div class="editor-wrapper">
                <CodeEditor
                  mode={EditorModes.JSON}
                  value={sampleJson}
                  on:change={e => onSampleChange(e.detail)}
                  placeholder={'{\n  "name": "John Doe",\n  "age": 30,\n  "items": [\n    { "id": 1, "title": "Example" }\n  ]\n}'}
                />
              </div>
              {#if sampleError}
                <div class="error-banner" role="alert">
                  <Icon name="warning-circle" size="S" />
                  <span>{sampleError}</span>
                </div>
              {/if}
            </div>
          </div>
        </Tab>

        <Tab title="JSON Schema">
          <div class="tab-content">
            <div class="input-section">
              <div class="section-header">
                <span class="section-icon">
                  <Icon name="brackets-curly" size="S" />
                </span>
                <Body size="S">Enter JSON schema definition</Body>
              </div>
              <div class="editor-wrapper">
                <CodeEditor
                  mode={EditorModes.JSON}
                  value={schemaJson}
                  on:change={e => onSchemaChange(e.detail)}
                  placeholder={'{\n  "type": "object",\n  "properties": {\n    "name": { "type": "string" },\n    "items": {\n      "type": "array",\n      "items": { "type": "object", "properties": {...} }\n    }\n  }\n}'}
                />
              </div>
              {#if schemaError}
                <div class="error-banner" role="alert">
                  <Icon name="warning-circle" size="S" />
                  <span>{schemaError}</span>
                </div>
              {/if}
              {#if validationErrors.length > 0}
                <div class="validation-errors" role="alert">
                  <div class="validation-header">
                    <Icon name="warning" size="S" />
                    <span>Schema validation issues</span>
                  </div>
                  <ul class="error-list">
                    {#each validationErrors as error}
                      <li>{error}</li>
                    {/each}
                  </ul>
                </div>
              {/if}
            </div>
          </div>
        </Tab>
      </Tabs>

      {#if previewSchema}
        <div class="preview-section">
          <div class="preview-header">
            <span class="preview-icon">
              <Icon name="eye" size="S" />
            </span>
            <Body size="S">Generated schema preview</Body>
          </div>
          <div class="preview-editor">
            <CodeEditor
              mode={EditorModes.JSON}
              value={JSON.stringify(previewSchema, null, 2)}
              readonly
            />
          </div>
        </div>
      {/if}
    </div>
  </ModalContent>
</Modal>

<style>
  .schema-editor {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }

  .tab-content {
    padding-top: var(--spacing-m);
  }

  .input-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }

  .section-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    background: var(--spectrum-global-color-gray-200);
    color: var(--spectrum-global-color-gray-700);
  }

  .editor-wrapper {
    height: 180px;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--border-radius-s);
    overflow: hidden;
    background: var(--spectrum-global-color-gray-50);
  }

  .editor-wrapper :global(.code-editor) {
    height: 100%;
  }

  .error-banner {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    padding: var(--spacing-s) var(--spacing-m);
    background: color-mix(
      in srgb,
      var(--spectrum-global-color-red-400) 12%,
      transparent
    );
    border: 1px solid
      color-mix(in srgb, var(--spectrum-global-color-red-400) 30%, transparent);
    border-radius: var(--border-radius-s);
    color: var(--spectrum-global-color-red-600);
    font-size: 12px;
  }

  .validation-errors {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    padding: var(--spacing-m);
    background: color-mix(
      in srgb,
      var(--spectrum-global-color-orange-400) 10%,
      transparent
    );
    border: 1px solid
      color-mix(
        in srgb,
        var(--spectrum-global-color-orange-400) 25%,
        transparent
      );
    border-radius: var(--border-radius-s);
  }

  .validation-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    color: var(--spectrum-global-color-orange-600);
    font-size: 12px;
    font-weight: 600;
  }

  .error-list {
    margin: 0;
    padding-left: var(--spacing-xl);
    font-size: 11px;
    color: var(--spectrum-global-color-gray-700);
    line-height: 1.6;
  }

  .error-list li {
    margin-bottom: 2px;
  }

  .preview-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
    padding-top: var(--spacing-m);
  }

  .preview-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }

  .preview-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    background: color-mix(
      in srgb,
      var(--spectrum-global-color-green-400) 15%,
      transparent
    );
    color: var(--spectrum-global-color-green-600);
  }

  .preview-editor {
    height: 140px;
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: var(--border-radius-s);
    overflow: hidden;
    background: var(--spectrum-global-color-gray-100);
  }

  .preview-editor :global(.code-editor) {
    height: 100%;
  }

  .preview-editor :global(.cm-editor) {
    background: var(--spectrum-global-color-gray-100) !important;
  }
</style>
