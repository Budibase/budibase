<script>
  import { onMount, getContext } from "svelte"
  import { SignatureModal } from "@budibase/frontend-core/src/components"
  import { CoreSignature, ActionButton } from "@budibase/bbui"

  export let schema
  export let value
  export let focused = false
  export let onChange
  export let readonly = false
  export let api
  export let invertX = false
  export let invertY = false

  const { API, notifications, props } = getContext("grid")

  let isOpen = false
  let signature
  let modal

  $: if (value) {
    const [attachment] = value
    signature = attachment
  }

  $: editable = focused && !readonly
  $: {
    if (!focused) {
      close()
    }
  }

  const onKeyDown = () => {
    return false
  }

  const open = () => {
    isOpen = true
  }

  const close = () => {
    isOpen = false
  }

  const deleteSignature = async () => {
    onChange([])
  }

  const saveSignature = async sigCanvas => {
    const signatureFile = sigCanvas.toFile()

    let attachRequest = new FormData()
    attachRequest.append("file", signatureFile)

    try {
      const uploadReq = await API.uploadBuilderAttachment(attachRequest)
      onChange(uploadReq)
    } catch (error) {
      $notifications.error(error.message || "Failed to save signature")
      return []
    }
  }

  onMount(() => {
    api = {
      focus: () => open(),
      blur: () => close(),
      isActive: () => isOpen,
      onKeyDown,
    }
  })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="signature-cell"
  class:light={!$props?.darkMode}
  class:editable
  on:click={editable ? open : null}
>
  {#if signature?.url}
    <!-- svelte-ignore a11y-missing-attribute -->
    <img src={signature?.url} />
  {/if}
</div>

<SignatureModal
  onConfirm={saveSignature}
  title={schema?.name}
  {value}
  darkMode={$props.darkMode}
  bind:this={modal}
/>

{#if isOpen}
  <div class="signature" class:invertX class:invertY class:empty={!signature}>
    {#if signature?.key}
      <div class="signature-wrap">
        <CoreSignature
          darkMode={$props.darkMode}
          editable={false}
          {value}
          on:change={saveSignature}
          on:clear={deleteSignature}
        />
      </div>
    {:else}
      <div class="add-signature">
        <ActionButton
          fullWidth
          on:click={() => {
            modal.show()
          }}
        >
          Add signature
        </ActionButton>
      </div>
    {/if}
  </div>
{/if}

<style>
  .signature {
    min-width: 320px;
  }
  .signature.empty {
    width: 100%;
    min-width: unset;
  }
  .signature-cell.light img {
    -webkit-filter: invert(100%);
    filter: invert(100%);
  }
  .signature-cell {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    max-width: 320px;
    padding-left: var(--cell-padding);
    padding-right: var(--cell-padding);
    flex-wrap: nowrap;
    align-self: stretch;
    overflow: hidden;
    user-select: none;
  }
  .signature-cell.editable:hover {
    cursor: pointer;
  }
  .signature {
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--grid-background-alt);
    border: var(--cell-border);
    padding: var(--cell-padding);
  }
  .signature-wrap {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    background-color: var(--spectrum-global-color-gray-50);
    color: var(--spectrum-alias-text-color);
    box-sizing: border-box;
    position: relative;
  }
  .signature.invertX {
    left: auto;
    right: 0;
  }
  .signature.invertY {
    transform: translateY(-100%);
    top: 0;
  }
</style>
