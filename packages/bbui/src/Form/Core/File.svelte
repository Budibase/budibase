<script lang="ts">
  import ActionButton from "../../ActionButton/ActionButton.svelte"
  import { uuid } from "../../helpers"
  import Icon from "../../Icon/Icon.svelte"
  import { createEventDispatcher } from "svelte"

  const BYTES_IN_MB = 1000000

  export let value: File | undefined = undefined
  export let title: string = "Upload file"
  export let disabled: boolean = false
  export let allowClear: boolean | undefined = undefined
  export let extensions: string[] | undefined = undefined
  export let handleFileTooLarge: ((_file: File) => void) | undefined = undefined
  export let fileSizeLimit: number = BYTES_IN_MB * 20
  export let id: string | undefined = undefined
  export let previewUrl: string | undefined = undefined
  export let hideButton: boolean = false
  export let multiple: boolean = false

  const fieldId = id || uuid()
  const BYTES_IN_KB = 1000

  const dispatch = createEventDispatcher()

  let fileInput: HTMLInputElement | undefined

  $: inputAccept = Array.isArray(extensions) ? extensions.join(",") : "*"
  $: files = Array.isArray(value) ? value : value ? [value] : []
  $: previews = Array.isArray(previewUrl)
    ? previewUrl
    : previewUrl
    ? [previewUrl]
    : []

  function formatFileSize(size: number) {
    if (!size) return ""
    if (size <= BYTES_IN_MB) {
      return `${Math.round(size / BYTES_IN_KB)} KB`
    }
    return `${(size / BYTES_IN_MB).toFixed(1)} MB`
  }

  async function processFile(targetFile: File | undefined) {
    if (targetFile) {
      if (handleFileTooLarge && targetFile.size >= fileSizeLimit) {
        handleFileTooLarge(targetFile)
        return
      }
      dispatch("change", targetFile)
    }
  }

  function handleFile(evt: Event) {
    const target = evt.target as HTMLInputElement
    if (multiple && target.files?.length) {
      dispatch("multipleFiles", Array.from(target.files))
    } else {
      processFile(target.files?.[0])
    }
  }

  function clearFile(index: number) {
    if (multiple) {
      const newFiles = files.filter((_, i) => i !== index)
      dispatch("change", newFiles.length ? newFiles : null)
    } else {
      dispatch("change", null)
    }
  }
</script>

<input
  id={fieldId}
  {disabled}
  type="file"
  accept={inputAccept}
  bind:this={fileInput}
  on:change={handleFile}
  {multiple}
/>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="field">
  <div class="files-list">
    {#each files as file, index}
      <div class="file-view">
        {#if previews[index]}
          <img class="preview" alt="" src={previews[index]} />
        {/if}
        <div class="filename">{file.name || `File ${index + 1}`}</div>
        {#if file.size}
          <div class="filesize">{formatFileSize(file.size)}</div>
        {/if}
        {#if !disabled || (allowClear === true && disabled)}
          <div class="delete-button" on:click={() => clearFile(index)}>
            <Icon name="Close" size="XS" />
          </div>
        {/if}
      </div>
    {/each}
  </div>
  {#if !hideButton}
    <div class="upload-button">
      <ActionButton {disabled} on:click={() => fileInput?.click()}>
        {title}
      </ActionButton>
    </div>
  {/if}
</div>

<style>
  .field {
    display: flex;
    gap: var(--spacing-m);
  }

  .files-list {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    gap: var(--spacing-s);
  }

  .file-view {
    display: flex;
    gap: var(--spacing-l);
    align-items: center;
    border: 1px solid var(--spectrum-alias-border-color);
    border-radius: var(--spectrum-global-dimension-size-50);
    padding: 0px var(--spectrum-alias-item-padding-m);
    height: 30px;
  }
  input[type="file"] {
    display: none;
  }
  .delete-button {
    transition: all 0.3s;
    margin-left: 10px;
    display: flex;
  }
  .delete-button:hover {
    cursor: pointer;
    color: var(--red);
  }
  .filesize {
    white-space: nowrap;
  }
  .filename {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .preview {
    height: 1.5em;
  }
</style>
