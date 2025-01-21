<script>
  import {
    Select,
    DatePicker,
    Multiselect,
    TextArea,
    Toggle,
  } from "@budibase/bbui"
  import { FieldType } from "@budibase/types"
  import LinkedRowSelector from "@/components/common/LinkedRowSelector.svelte"
  import DrawerBindableInput from "../../common/bindings/DrawerBindableInput.svelte"
  import ModalBindableInput from "../../common/bindings/ModalBindableInput.svelte"
  import AutomationBindingPanel from "../../common/bindings/ServerBindingPanel.svelte"
  import CodeEditor from "@/components/common/CodeEditor/CodeEditor.svelte"
  import KeyValueBuilder from "@/components/integration/KeyValueBuilder.svelte"
  import {
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "@/dataBinding"

  export let onChange
  export let field
  export let schema
  export let value
  export let meta
  export let bindings
  export let isTestModal

  $: fieldData = value[field]

  $: parsedBindings = bindings.map(binding => {
    let clone = Object.assign({}, binding)
    clone.icon = "ShareAndroid"
    return clone
  })

  $: readableValue = runtimeToReadableBinding(parsedBindings, fieldData)

  let attachmentTypes = [
    FieldType.ATTACHMENTS,
    FieldType.ATTACHMENT_SINGLE,
    FieldType.SIGNATURE_SINGLE,
  ]

  function schemaHasOptions(schema) {
    return !!schema.constraints?.inclusion?.length
  }

  function handleAttachmentParams(keyValueObj) {
    let params = {}
    if (!keyValueObj) {
      return null
    }

    if (!Array.isArray(keyValueObj) && keyValueObj) {
      keyValueObj = [keyValueObj]
    }

    if (keyValueObj.length) {
      for (let param of keyValueObj) {
        params[param.url || ""] = param.filename || ""
      }
    }
    return params
  }

  const handleMediaUpdate = e => {
    const media = e.detail || []
    const isSingle =
      schema.type === FieldType.ATTACHMENT_SINGLE ||
      schema.type === FieldType.SIGNATURE_SINGLE
    const parsedMedia = media.map(({ name, value }) => ({
      url: name,
      filename: value,
    }))

    if (isSingle) {
      const [singleMedia] = parsedMedia
      // Return only the first entry
      return singleMedia
        ? {
            url: singleMedia.url,
            filename: singleMedia.filename,
          }
        : null
    }

    // Return the entire array
    return parsedMedia
  }
</script>

{#if schemaHasOptions(schema) && schema.type !== "array"}
  <Select
    on:change={e =>
      onChange({
        row: {
          [field]: e.detail,
        },
      })}
    value={fieldData}
    options={schema.constraints.inclusion}
  />
{:else if schema.type === "datetime"}
  <DatePicker
    value={fieldData}
    on:change={e =>
      onChange({
        row: {
          [field]: e.detail,
        },
      })}
  />
{:else if schema.type === "boolean"}
  <Select
    on:change={e =>
      onChange({
        row: {
          [field]: e.detail,
        },
      })}
    value={fieldData}
    options={[
      { label: "True", value: "true" },
      { label: "False", value: "false" },
    ]}
  />
{:else if schemaHasOptions(schema) && schema.type === "array"}
  <Multiselect
    value={fieldData}
    options={schema.constraints.inclusion}
    on:change={e =>
      onChange({
        row: {
          [field]: e.detail,
        },
      })}
  />
{:else if schema.type === "longform"}
  <TextArea
    value={readableValue}
    on:change={e =>
      onChange({
        row: {
          [field]: readableToRuntimeBinding(parsedBindings, e.detail),
        },
      })}
  />
{:else if schema.type === "json"}
  <span>
    <div class="field-wrap json-field">
      <CodeEditor
        value={readableValue}
        on:blur={e => {
          onChange({
            row: {
              [field]: readableToRuntimeBinding(parsedBindings, e.detail),
            },
          })
        }}
      />
    </div>
  </span>
{:else if schema.type === "link"}
  <LinkedRowSelector
    linkedData={fieldData}
    {schema}
    on:change={e =>
      onChange({
        row: {
          [field]: e.detail,
        },
      })}
    useLabel={false}
  />
{:else if schema.type === "bb_reference" || schema.type === "bb_reference_single"}
  <LinkedRowSelector
    linkedData={fieldData}
    {schema}
    linkedTableId={"ta_users"}
    on:change={e =>
      onChange({
        row: {
          [field]: e.detail,
        },
      })}
    useLabel={false}
  />
{:else if attachmentTypes.includes(schema.type)}
  <div class="attachment-field-container">
    <div class="toggle-container">
      <Toggle
        value={meta?.fields?.[field]?.useAttachmentBinding}
        text={"Use bindings"}
        size={"XS"}
        on:change={e => {
          onChange({
            row: {
              [field]: null,
            },
            meta: {
              fields: {
                [field]: {
                  useAttachmentBinding: e.detail,
                },
              },
            },
          })
        }}
      />
    </div>

    {#if !meta?.fields?.[field]?.useAttachmentBinding}
      <div class="attachment-field-spacing">
        <KeyValueBuilder
          on:change={e => {
            onChange({
              row: {
                [field]: handleMediaUpdate(e),
              },
            })
          }}
          object={handleAttachmentParams(fieldData)}
          allowJS
          {bindings}
          keyBindings
          customButtonText={schema.type === FieldType.SIGNATURE_SINGLE
            ? "Add signature"
            : "Add attachment"}
          keyPlaceholder={"URL"}
          valuePlaceholder={"Filename"}
          actionButtonDisabled={(schema.type === FieldType.ATTACHMENT_SINGLE ||
            schema.type === FieldType.SIGNATURE_SINGLE) &&
            fieldData}
        />
      </div>
    {:else}
      <div class="json-input-spacing">
        <svelte:component
          this={isTestModal ? ModalBindableInput : DrawerBindableInput}
          panel={AutomationBindingPanel}
          value={fieldData}
          on:change={e =>
            onChange({
              row: {
                [field]: e.detail,
              },
            })}
          type="string"
          bindings={parsedBindings}
          allowJS={true}
          updateOnChange={false}
          title={schema.name}
        />
      </div>
    {/if}
  </div>
{:else if ["string", "number", "bigint", "barcodeqr", "array"].includes(schema.type)}
  <svelte:component
    this={isTestModal ? ModalBindableInput : DrawerBindableInput}
    panel={AutomationBindingPanel}
    value={fieldData}
    on:change={e =>
      onChange({
        row: {
          [field]: e.detail,
        },
      })}
    type="string"
    bindings={parsedBindings}
    allowJS={true}
    updateOnChange={false}
    title={schema.name}
    autocomplete="off"
  />
{/if}

<style>
  .attachment-field-spacing {
    border: 1px solid var(--spectrum-global-color-gray-400);
    border-radius: 4px;
    padding: var(--spacing-s);
  }

  .field-wrap.json-field {
    height: 120px;
  }

  .field-wrap {
    box-sizing: border-box;
    border: 1px solid var(--spectrum-global-color-gray-400);
    border-radius: 4px;
  }

  .field-wrap :global(.cm-editor),
  .field-wrap :global(.cm-scroller) {
    border-radius: 4px;
  }
</style>
