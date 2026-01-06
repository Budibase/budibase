<script lang="ts">
  import {
    ActionButton,
    Modal,
    ModalContent,
    Tabs,
    Tab,
    Body,
  } from "@budibase/bbui"
  import { helpers } from "@budibase/shared-core"
  import CodeEditor from "@/components/common/CodeEditor/CodeEditor.svelte"
  import { EditorModes } from "@/components/common/CodeEditor"
  import { createEventDispatcher, onMount } from "svelte"
  import toJsonSchema from "to-json-schema"
  import Ajv from "ajv"
  import type { JSONSchema7 } from "json-schema"

  type JSONSchema = JSONSchema7

  const ajv = new Ajv()

  /**
   * Normalizes a JSON schema to be compatible with OpenAI's structured output requirements.
   * This is the strictest format, so schemas that pass OpenAI validation should work with other providers.
   *
   * Fixes:
   * - Adds `additionalProperties: false` to all object schemas (required by OpenAI)
   * - Converts `required: true` boolean to proper array format
   * - Ensures top-level type is "object" (wraps arrays if needed)
   * - Recursively processes nested schemas
   */
  // Implemented via shared helper: helpers.structuredOutput.normalizeSchemaForStructuredOutput
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

  export let value: JSONSchema | Record<string, unknown> = {}

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

  $: fieldCount = countSchemaFields(value || {})

  function countSchemaFields(
    schema: JSONSchema | Record<string, unknown>
  ): number {
    if (schema && typeof schema === "object" && "properties" in schema) {
      return Object.keys(schema.properties || {}).length
    }
    return Object.keys(schema || {}).length
  }

  function initializeFromValue() {
    if (value && Object.keys(value).length > 0) {
      schemaJson = JSON.stringify(value, null, 2)
      previewSchema = value as JSONSchema
    }
  }

  onMount(() => {
    initializeFromValue()
  })

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
    modal.show()
  }
</script>

<ActionButton fullWidth on:click={openModal}>
  {fieldCount > 0
    ? `Edit Schema (${fieldCount} fields)`
    : "Define Output Schema"}
</ActionButton>

<Modal bind:this={modal}>
  <ModalContent
    title="Structured Output Schema"
    confirmText="Save Schema"
    onConfirm={saveSchema}
    disabled={!isValid(generatedSchema)}
    size="L"
  >
    <div class="schema-editor">
      <Tabs selected={activeTab} on:select={handleTabChange}>
        <Tab title="From Sample">
          <div class="tab-content">
            <div class="input-section">
              <div class="section-header">
                <span class="section-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M4 4h8M4 8h6M4 12h8"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                  </svg>
                </span>
                <Body size="S">Paste sample JSON data</Body>
              </div>
              <p class="helper-text">
                We'll automatically generate the schema from your example.
              </p>
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
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle
                      cx="8"
                      cy="8"
                      r="7"
                      stroke="currentColor"
                      stroke-width="1.5"
                    />
                    <path
                      d="M8 4.5v4M8 10.5v1"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                  </svg>
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
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect
                      x="2"
                      y="2"
                      width="12"
                      height="12"
                      rx="2"
                      stroke="currentColor"
                      stroke-width="1.5"
                    />
                    <path
                      d="M5 6h6M5 8h4M5 10h6"
                      stroke="currentColor"
                      stroke-width="1"
                      stroke-linecap="round"
                    />
                  </svg>
                </span>
                <Body size="S">Enter JSON Schema definition</Body>
              </div>
              <p class="helper-text">
                Provide a standard JSON Schema to validate the AI output
                structure.
              </p>
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
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle
                      cx="8"
                      cy="8"
                      r="7"
                      stroke="currentColor"
                      stroke-width="1.5"
                    />
                    <path
                      d="M8 4.5v4M8 10.5v1"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                  </svg>
                  <span>{schemaError}</span>
                </div>
              {/if}
              {#if validationErrors.length > 0}
                <div class="validation-errors" role="alert">
                  <div class="validation-header">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 1L15 14H1L8 1z"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M8 6v4M8 12v1"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                    </svg>
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
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle
                  cx="8"
                  cy="8"
                  r="3"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path
                  d="M1 8c1.5-3 4-5 7-5s5.5 2 7 5c-1.5 3-4 5-7 5s-5.5-2-7-5z"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
              </svg>
            </span>
            <Body size="S">Generated Schema Preview</Body>
            <span class="preview-badge">
              {#if previewSchema.properties}
                {Object.keys(previewSchema.properties).length} fields
              {:else}
                Ready
              {/if}
            </span>
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

  .helper-text {
    margin: 0;
    font-size: 12px;
    color: var(--spectrum-global-color-gray-600);
    line-height: 1.4;
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
    border-top: 1px solid var(--spectrum-global-color-gray-200);
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

  .preview-badge {
    margin-left: auto;
    padding: 2px 8px;
    background: var(--spectrum-global-color-gray-200);
    border-radius: 10px;
    font-size: 10px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-700);
    text-transform: uppercase;
    letter-spacing: 0.5px;
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
