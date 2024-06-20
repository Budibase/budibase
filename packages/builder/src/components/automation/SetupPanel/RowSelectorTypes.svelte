<script>
  import {
    Select,
    DatePicker,
    Multiselect,
    TextArea,
    Toggle,
  } from "@budibase/bbui"
  import { FieldType } from "@budibase/types"
  import LinkedRowSelector from "components/common/LinkedRowSelector.svelte"
  import DrawerBindableInput from "../../common/bindings/DrawerBindableInput.svelte"
  import ModalBindableInput from "../../common/bindings/ModalBindableInput.svelte"
  import AutomationBindingPanel from "../../common/bindings/ServerBindingPanel.svelte"
  import Editor from "components/integration/QueryEditor.svelte"
  import KeyValueBuilder from "components/integration/KeyValueBuilder.svelte"

  export let onChange
  export let field
  export let schema
  export let value
  export let meta
  export let bindings
  export let isTestModal

  $: console.log(field + "VALUE???", value[field])

  $: parsedBindings = bindings.map(binding => {
    let clone = Object.assign({}, binding)
    clone.icon = "ShareAndroid"
    return clone
  })

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
    // DEAN - review this
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
    console.log("handleAttachmentParams ", params)
    return params
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
    value={value[field]}
    options={schema.constraints.inclusion}
  />
{:else if schema.type === "datetime"}
  <DatePicker
    value={value[field]}
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
    value={value[field]}
    options={[
      { label: "True", value: "true" },
      { label: "False", value: "false" },
    ]}
  />
{:else if schemaHasOptions(schema) && schema.type === "array"}
  <Multiselect
    value={value[field]}
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
    value={value[field]}
    on:change={e =>
      onChange({
        row: {
          [field]: e.detail,
        },
      })}
  />
{:else if schema.type === "json"}
  <span>
    <Editor
      editorHeight="150"
      mode="json"
      on:change={e => {
        if (e.detail?.value !== value[field]) {
          onChange({
            row: {
              [field]: e.detail,
            },
          })
        }
      }}
      value={value[field]}
    />
  </span>
{:else if schema.type === "link"}
  <LinkedRowSelector
    linkedRows={value[field]}
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
    linkedRows={value[field]}
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
          const fromFalse =
            !meta?.fields?.[field]?.useAttachmentBinding && e.detail === true
          onChange({
            ...(fromFalse
              ? {
                  row: {
                    [field]: "", //clear the value if switching
                  },
                }
              : {}),
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
          on:change={e =>
            onChange({
              row: {
                [field]:
                  schema.type === FieldType.ATTACHMENT_SINGLE ||
                  schema.type === FieldType.SIGNATURE_SINGLE
                    ? e.detail.length > 0
                      ? {
                          url: e.detail[0].name,
                          filename: e.detail[0].value,
                        }
                      : {}
                    : e.detail.map(({ name, value }) => ({
                        url: name,
                        filename: value,
                      })),
              },
            })}
          object={handleAttachmentParams(value[field], false)}
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
            Object.keys(value[field] || {}).length >= 1}
        />
      </div>
    {:else}
      <div class="json-input-spacing">
        {JSON.stringify(value[field])}
        <svelte:component
          this={isTestModal ? ModalBindableInput : DrawerBindableInput}
          panel={AutomationBindingPanel}
          value={value[field]}
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
  {JSON.stringify(value[field])}
  <svelte:component
    this={isTestModal ? ModalBindableInput : DrawerBindableInput}
    panel={AutomationBindingPanel}
    value={value[field]}
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
  .attachment-field-spacing,
  .json-input-spacing {
    margin-top: var(--spacing-s);
    border: 1px solid var(--spectrum-global-color-gray-400);
    border-radius: 4px;
    padding: var(--spacing-s);
  }
</style>
