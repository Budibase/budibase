<script>
  import { CoreSignature, ActionButton } from "@budibase/bbui"
  import { getContext } from "svelte"
  import Field from "./Field.svelte"
  import { SignatureModal } from "@budibase/frontend-core/src/components"

  export let field
  export let label
  export let disabled = false
  export let readonly = false
  export let validation
  export let onChange
  export let span
  export let helpText = null

  let fieldState
  let fieldApi
  let fieldSchema
  let modal

  const { API, notificationStore, builderStore } = getContext("sdk")
  const context = getContext("context")
  const formContext = getContext("form")

  const saveSignature = async canvas => {
    try {
      const signatureFile = canvas.toFile()
      let updateValue

      if (signatureFile) {
        let attachRequest = new FormData()
        attachRequest.append("file", signatureFile)

        const resp = await API.uploadAttachment(
          formContext?.dataSource?.tableId,
          attachRequest
        )
        const [signatureAttachment] = resp
        updateValue = signatureAttachment
      } else {
        updateValue = null
      }

      const changed = fieldApi.setValue(updateValue)
      if (onChange && changed) {
        onChange({ value: updateValue })
      }
    } catch (error) {
      notificationStore.actions.error(
        `There was a problem saving your signature`
      )
      console.error(error)
    }
  }

  const deleteSignature = async () => {
    const changed = fieldApi.setValue(null)
    if (onChange && changed) {
      onChange({ value: null })
    }
  }

  $: currentTheme = $context?.device?.theme
  $: darkMode = !currentTheme?.includes("light")
</script>

<SignatureModal
  onConfirm={saveSignature}
  title={label || fieldSchema?.name || ""}
  value={fieldState?.value}
  {darkMode}
  bind:this={modal}
/>

<Field
  {label}
  {field}
  {disabled}
  {readonly}
  {validation}
  {span}
  {helpText}
  type="signature_single"
  bind:fieldState
  bind:fieldApi
  bind:fieldSchema
  defaultValue={[]}
>
  {#if fieldState}
    {#if (Array.isArray(fieldState?.value) && !fieldState?.value?.length) || !fieldState?.value}
      <ActionButton
        fullWidth
        disabled={fieldState.disabled}
        on:click={() => {
          if (!$builderStore.inBuilder) {
            modal.show()
          }
        }}
      >
        Add signature
      </ActionButton>
    {:else}
      <div class="signature-field">
        <CoreSignature
          {darkMode}
          disabled={$builderStore.inBuilder || fieldState.disabled}
          editable={false}
          value={fieldState?.value}
          on:clear={deleteSignature}
        />
      </div>
    {/if}
  {/if}
</Field>

<style>
  .signature-field {
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
