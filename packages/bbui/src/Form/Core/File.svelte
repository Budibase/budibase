<script lang="ts">
  import ActionButton from "../../ActionButton/ActionButton.svelte"
  import { uuid } from "../../helpers"
  import Icon from "../../Icon/Icon.svelte"
  import { createEventDispatcher } from "svelte"

  const BYTES_IN_MB = 1000000

  export let value: File | undefined = undefined
  export let statusText: string | undefined = undefined
  export let title: string = "Upload file"
  export let disabled: boolean = false
  export let allowClear: boolean | undefined = undefined
  export let extensions: string[] | undefined = undefined
  export let handleFileTooLarge: ((_file: File) => void) | undefined = undefined
  export let fileSizeLimit: number = BYTES_IN_MB * 20
  export let id: string | undefined = undefined
  export let previewUrl: string | undefined = undefined

  const fieldId = id || uuid()
  const BYTES_IN_KB = 1000

  const dispatch = createEventDispatcher()

  let fileInput: HTMLInputElement | undefined

  $: inputAccept = Array.isArray(extensions) ? extensions.join(",") : "*"

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
    processFile(target.files?.[0])
  }

  function clearFile() {
    dispatch("change", undefined)
  }
</script>

<input
  id={fieldId}
  {disabled}
  type="file"
  accept={inputAccept}
  bind:this={fileInput}
  on:change={handleFile}
/>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="field">
  {#if statusText}
    <div class="file-view status">
      <div class="filename">{statusText}</div>
      {#if !disabled || (allowClear === true && disabled)}
        <div class="delete-button" on:click={clearFile}>
          <Icon name="Close" size="XS" />
        </div>
      {/if}
    </div>
  {:else if value}
    <div class="file-view">
      {#if previewUrl}
        <img class="preview" alt="" src={previewUrl} />
      {/if}
      <div class="filename">{value.name}</div>
      {#if value.size}
        <div class="filesize">
          {#if value.size <= BYTES_IN_MB}
            {`${value.size / BYTES_IN_KB} KB`}
          {:else}
            {`${value.size / BYTES_IN_MB} MB`}
          {/if}
        </div>
      {/if}
      {#if !disabled || (allowClear === true && disabled)}
        <div class="delete-button" on:click={clearFile}>
          <Icon name="Close" size="XS" />
        </div>
      {/if}
    </div>
  {/if}
  <ActionButton {disabled} on:click={() => fileInput?.click()}>
    {title}
  </ActionButton>
</div>

<style>
  .field {
    display: flex;
    gap: var(--spacing-m);
  }
  .file-view {
    display: flex;
    gap: var(--spacing-l);
    align-items: center;
    border: 1px solid var(--spectrum-alias-border-color);
    border-radius: var(--spectrum-global-dimension-size-50);
    padding: 0px var(--spectrum-alias-item-padding-m);
  }
  .file-view.status {
    background-color: var(--spectrum-global-color-gray-100);
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
