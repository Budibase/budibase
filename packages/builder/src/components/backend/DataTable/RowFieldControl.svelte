<script>
  import { API } from "@/api"
  import {
    Input,
    Select,
    DatePicker,
    Toggle,
    Multiselect,
    Label,
    RichTextField,
    TextArea,
    CoreSignature,
    ActionButton,
    notifications,
  } from "@budibase/bbui"
  import Dropzone from "@/components/common/Dropzone.svelte"
  import { capitalise } from "@/helpers"
  import LinkedRowSelector from "@/components/common/LinkedRowSelector.svelte"
  import Editor from "../../integration/QueryEditor.svelte"
  import { SignatureModal } from "@budibase/frontend-core/src/components"
  import { themeStore } from "@/stores/portal"

  export let meta
  export let value
  export let readonly
  export let error

  const resolveTimeStamp = timestamp => {
    if (!timestamp) {
      return null
    }
    let maskedDate = new Date(`0-${timestamp}`)
    if (maskedDate instanceof Date && !isNaN(maskedDate.getTime())) {
      return maskedDate
    } else {
      return null
    }
  }

  $: stringVal =
    typeof value === "object" ? JSON.stringify(value, null, 2) : value
  $: type = meta?.type
  $: label = meta.name ? capitalise(meta.name) : ""

  const timeStamp = resolveTimeStamp(value)
  const isTimeStamp = !!timeStamp || meta?.timeOnly

  $: currentTheme = $themeStore?.theme
  $: darkMode = !currentTheme.includes("light")

  let signatureModal
</script>

<SignatureModal
  {darkMode}
  onConfirm={async sigCanvas => {
    const signatureFile = sigCanvas.toFile()

    let attachRequest = new FormData()
    attachRequest.append("file", signatureFile)

    try {
      const uploadReq = await API.uploadBuilderAttachment(attachRequest)
      const [signatureAttachment] = uploadReq
      value = signatureAttachment
    } catch (error) {
      $notifications.error(error.message || "Failed to save signature")
      value = []
    }
  }}
  title={meta.name}
  {value}
  bind:this={signatureModal}
/>

{#if type === "options" && meta.constraints.inclusion.length !== 0}
  <Select
    {label}
    bind:value
    options={meta.constraints.inclusion}
    sort
    {error}
  />
{:else if type === "datetime"}
  <DatePicker
    {error}
    {label}
    timeOnly={isTimeStamp}
    enableTime={!meta?.dateOnly}
    ignoreTimezones={meta?.ignoreTimezones}
    bind:value
  />
{:else if type === "attachment"}
  <Dropzone
    {label}
    {error}
    {value}
    on:change={e => {
      value = e.detail
    }}
  />
{:else if type === "attachment_single"}
  <Dropzone
    {label}
    {error}
    value={value ? [value] : []}
    on:change={e => {
      value = e.detail?.[0]
    }}
    maximum={1}
  />
{:else if type === "signature_single"}
  <div class="signature">
    <Label>{label}</Label>
    <div class="sig-wrap" class:display={value}>
      {#if value}
        <CoreSignature
          {darkMode}
          {value}
          editable={false}
          on:clear={() => {
            value = null
          }}
        />
      {:else}
        <ActionButton
          fullWidth
          on:click={() => {
            signatureModal.show()
          }}
        >
          Add signature
        </ActionButton>
      {/if}
    </div>
  </div>
{:else if type === "boolean"}
  <Toggle text={label} {error} bind:value />
{:else if type === "array" && meta.constraints.inclusion.length !== 0}
  <Multiselect
    bind:value
    {error}
    {label}
    options={meta.constraints.inclusion}
  />
{:else if type === "link"}
  <LinkedRowSelector
    {error}
    linkedData={value}
    schema={meta}
    on:change={e => (value = e.detail)}
  />
{:else if type === "longform"}
  {#if meta.useRichText}
    <RichTextField {error} {label} height="150px" bind:value />
  {:else}
    <TextArea {error} {label} height="150px" bind:value />
  {/if}
{:else if type === "json"}
  <Label>{label}</Label>
  <Editor
    editorHeight="250"
    editorWidth="320"
    mode="json"
    on:change={({ detail }) => (value = detail.value)}
    value={stringVal}
    {error}
  />
{:else}
  <Input {label} {type} {error} bind:value disabled={readonly} />
{/if}

<style>
  .signature :global(label.spectrum-FieldLabel) {
    padding-top: var(--spectrum-fieldlabel-padding-top);
    padding-bottom: var(--spectrum-fieldlabel-padding-bottom);
  }
  .sig-wrap.display {
    min-height: 50px;
    justify-content: center;
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--spectrum-global-color-gray-50);
    box-sizing: border-box;
    border: var(--spectrum-alias-border-size-thin)
      var(--spectrum-alias-border-color) solid;
    border-radius: var(--spectrum-alias-border-radius-regular);
  }
</style>
