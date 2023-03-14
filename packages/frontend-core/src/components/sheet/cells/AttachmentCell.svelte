<script>
  import { onMount } from "svelte"
  import { getContext } from "svelte"
  import { Dropzone, notifications } from "@budibase/bbui"

  export let value
  export let selected = false
  export let onChange
  export let readonly = false
  export let api

  const { API } = getContext("sheet")
  const imageExtensions = ["png", "tiff", "gif", "raw", "jpg", "jpeg"]

  let isOpen = false

  $: editable = selected && !readonly
  $: {
    if (!selected) {
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
    notifications.error(
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
      notifications.error("Failed to upload attachment")
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
  <div class="dropzone">
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
    align-items: center;
    padding: 0 var(--cell-padding);
    flex-wrap: nowrap;
    gap: var(--cell-spacing);
    align-self: stretch;
  }
  .attachment-cell.editable:hover {
    cursor: pointer;
  }
  .file {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: calc(var(--cell-height) - 12px);
    padding: 0 8px;
    color: var(--spectrum-global-color-gray-800);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 4px;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 10px;
  }
  img {
    height: calc(var(--cell-height) - 12px);
    max-width: 64px;
  }
  .dropzone {
    position: absolute;
    top: -1px;
    left: -1px;
    width: 320px;
    background: var(--cell-background);
    border: var(--cell-border);
    box-shadow: 0 0 8px 4px rgba(0, 0, 0, 0.15);
    padding: var(--cell-padding);
  }
</style>
