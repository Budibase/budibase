<script>
  import { onMount } from "svelte"
  import { getContext } from "svelte"
  import { Dropzone } from "@budibase/bbui"

  export let value
  export let focused = false
  export let onChange
  export let readonly = false
  export let api
  export let invertX = false
  export let invertY = false

  const { API, notifications } = getContext("grid")
  const imageExtensions = ["png", "tiff", "gif", "raw", "jpg", "jpeg"]

  let isOpen = false

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
      $notifications.error("Failed to upload attachment")
      return []
    }
  }

  const deleteAttachments = async fileList => {
    try {
      return await API.deleteBuilderAttachments(fileList)
    } catch (error) {
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

<div class="attachment-cell" class:editable on:click={editable ? open : null}>
  {#each value || [] as attachment}
    {#if isImage(attachment.extension)}
      <img src={attachment.url} alt={attachment.extension} />
    {:else}
      <div class="file" title={attachment.name}>
        {attachment.extension}
      </div>
    {/if}
  {/each}
</div>

{#if isOpen}
  <div class="dropzone" class:invertX class:invertY>
    <Dropzone
      {value}
      compact
      on:change={e => onChange(e.detail)}
      {processFiles}
      {deleteAttachments}
      {handleFileTooLarge}
    />
  </div>
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
    position: absolute;
    top: 100%;
    left: 0;
    width: 320px;
    background: var(--grid-background-alt);
    border: var(--cell-border);
    padding: var(--cell-padding);
    box-shadow: 0 0 20px -4px rgba(0, 0, 0, 0.15);
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
  }
  .dropzone.invertX {
    left: auto;
    right: 0;
  }
  .dropzone.invertY {
    transform: translateY(-100%);
    top: 0;
  }
</style>
