<script>
  import { onMount, getContext } from "svelte"
  import { Dropzone } from "@budibase/bbui"
  import GridPopover from "../overlays/GridPopover.svelte"
  import { FieldType } from "@budibase/types"

  export let value
  export let focused = false
  export let onChange
  export let readonly = false
  export let api
  export let schema
  export let maximum

  const { API, notifications, props } = getContext("grid")
  const imageExtensions = ["png", "tiff", "gif", "raw", "jpg", "jpeg"]

  let isOpen = false
  let anchor

  $: editable = focused && !readonly
  $: {
    if (!focused) {
      close()
    }
  }

  const onKeyDown = () => {
    return isOpen
  }

  const open = () => {
    isOpen = true
  }

  const close = () => {
    isOpen = false
  }

  const isImage = extension => {
    return imageExtensions.includes(extension?.toLowerCase())
  }

  const handleFileTooLarge = fileSizeLimit => {
    $notifications.error(
      `Files cannot exceed ${
        fileSizeLimit / 1000000
      }MB. Please try again with smaller files.`
    )
  }

  const processFiles = async fileList => {
    let data = new FormData()
    for (let i = 0; i < fileList.length; i++) {
      data.append("file", fileList[i])
    }
    try {
      return await API.uploadBuilderAttachment(data)
    } catch (error) {
      $notifications.error(error.message || "Failed to upload attachment")
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
  class="attachment-cell"
  class:editable
  on:click={editable ? open : null}
  bind:this={anchor}
>
  {#each value || [] as attachment}
    {#if isImage(attachment.extension)}
      <img
        class:light={!$props?.darkMode &&
          schema.type === FieldType.SIGNATURE_SINGLE}
        src={attachment.url}
        alt={attachment.extension}
      />
    {:else}
      <div class="file" title={attachment.name}>
        {attachment.extension}
      </div>
    {/if}
  {/each}
</div>

{#if isOpen}
  <GridPopover open={isOpen} {anchor} maxHeight={null} on:close={close}>
    <div class="dropzone">
      <Dropzone
        {value}
        compact
        on:change={e => onChange(e.detail)}
        maximum={maximum || schema.constraints?.length?.maximum}
        {processFiles}
        handleFileTooLarge={$props.isCloud ? handleFileTooLarge : null}
      />
    </div>
  </GridPopover>
{/if}

<style>
  .attachment-cell {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    padding: var(--cell-padding);
    flex-wrap: nowrap;
    gap: var(--cell-spacing);
    align-self: stretch;
    overflow: hidden;
    user-select: none;
  }
  .attachment-cell.editable:hover {
    cursor: pointer;
  }
  .file {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 0 10px;
    color: var(--spectrum-global-color-gray-700);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 4px;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 12px;
    user-select: none;
  }
  .dropzone {
    background: var(--grid-background-alt);
    width: 320px;
    padding: var(--cell-padding);
  }

  .attachment-cell img.light {
    -webkit-filter: invert(100%);
    filter: invert(100%);
  }
</style>
