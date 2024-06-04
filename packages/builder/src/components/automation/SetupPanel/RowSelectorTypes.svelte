<script>
  import { Select, DatePicker, Multiselect, TextArea } from "@budibase/bbui"
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
  export let bindings
  export let isTestModal

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

    if (
      (schema.type === FieldType.ATTACHMENT_SINGLE ||
        schema.type === FieldType.SIGNATURE_SINGLE) &&
      Object.keys(keyValueObj).length === 0
    ) {
      return []
    }
    if (!Array.isArray(keyValueObj) && keyValueObj) {
      keyValueObj = [keyValueObj]
    }

    if (keyValueObj.length) {
      for (let param of keyValueObj) {
        params[param.url] = param.filename
      }
    }
    return params
  }
</script>

{#if schemaHasOptions(schema) && schema.type !== "array"}
  <Select
    on:change={e => onChange(e, field)}
    value={value[field]}
    options={schema.constraints.inclusion}
  />
{:else if schema.type === "datetime"}
  <DatePicker value={value[field]} on:change={e => onChange(e, field)} />
{:else if schema.type === "boolean"}
  <Select
    on:change={e => onChange(e, field)}
    value={value[field]}
    options={[
      { label: "True", value: "true" },
      { label: "False", value: "false" },
    ]}
  />
{:else if schemaHasOptions(schema) && schema.type === "array"}
  <Multiselect
    bind:value={value[field]}
    options={schema.constraints.inclusion}
    on:change={e => onChange(e, field)}
  />
{:else if schema.type === "longform"}
  <TextArea bind:value={value[field]} on:change={e => onChange(e, field)} />
{:else if schema.type === "json"}
  <span>
    <Editor
      editorHeight="150"
      mode="json"
      on:change={e => {
        if (e.detail?.value !== value[field]) {
          onChange(e, field, schema.type)
        }
      }}
      value={value[field]}
    />
  </span>
{:else if schema.type === "link"}
  <LinkedRowSelector
    linkedRows={value[field]}
    {schema}
    on:change={e => onChange(e, field)}
    useLabel={false}
  />
{:else if schema.type === "bb_reference" || schema.type === "bb_reference_single"}
  <LinkedRowSelector
    linkedRows={value[field]}
    {schema}
    linkedTableId={"ta_users"}
    on:change={e => onChange(e, field)}
    useLabel={false}
  />
{:else if attachmentTypes.includes(schema.type)}
  <div class="attachment-field-spacinng">
    <KeyValueBuilder
      on:change={e =>
        onChange(
          {
            detail:
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
          field
        )}
      object={handleAttachmentParams(value[field])}
      allowJS
      {bindings}
      keyBindings
      customButtonText={"Add attachment"}
      keyPlaceholder={"URL"}
      valuePlaceholder={"Filename"}
      actionButtonDisabled={(schema.type === FieldType.ATTACHMENT_SINGLE ||
        schema.type === FieldType.SIGNATURE) &&
        Object.keys(value[field]).length >= 1}
    />
  </div>
{:else if ["string", "number", "bigint", "barcodeqr", "array"].includes(schema.type)}
  <svelte:component
    this={isTestModal ? ModalBindableInput : DrawerBindableInput}
    panel={AutomationBindingPanel}
    value={value[field]}
    on:change={e => onChange(e, field)}
    type="string"
    bindings={parsedBindings}
    allowJS={true}
    updateOnChange={false}
    title={schema.name}
  />
{/if}

<style>
  .attachment-field-spacinng {
    margin-top: var(--spacing-s);
    margin-bottom: var(--spacing-l);
  }
</style>
