<script>
  import { onMount, getContext } from "svelte"
  import { SignatureModal } from "@budibase/frontend-core/src/components"
  import { CoreSignature, ActionButton } from "@budibase/bbui"
  import GridPopover from "../overlays/GridPopover.svelte"

  export let schema
  export let value
  export let focused = false
  export let onChange
  export let readonly = false
  export let api

  const { API, notifications, props } = getContext("grid")

  let isOpen = false
  let modal
  let anchor

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
    onChange(null)
  }

  const saveSignature = async sigCanvas => {
    const signatureFile = sigCanvas.toFile()

    let attachRequest = new FormData()
    attachRequest.append("file", signatureFile)

    try {
      const uploadReq = await API.uploadBuilderAttachment(attachRequest)
      const [signatureAttachment] = uploadReq
      onChange(signatureAttachment)
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
  bind:this={anchor}
  on:click={editable ? open : null}
>
  {#if value?.url}
    <!-- svelte-ignore a11y-missing-attribute -->
    <img src={value?.url} />
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
  <GridPopover open={isOpen} {anchor} maxHeight={null} on:close={close}>
    <div class="signature" class:empty={!value}>
      {#if value?.key}
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
  </GridPopover>
{/if}

<style>
  .signature {
    min-width: 320px;
    padding: var(--cell-padding);
    background: var(--grid-background-alt);
    border: var(--cell-border);
  }
  .signature.empty {
    width: 100%;
    min-width: unset;
  }
  .signature-cell img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
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
</style>
