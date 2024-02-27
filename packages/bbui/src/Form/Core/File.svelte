<script>
  import ActionButton from "../../ActionButton/ActionButton.svelte"
  import { uuid } from "../../helpers"
  import Icon from "../../Icon/Icon.svelte"
  import { createEventDispatcher } from "svelte"

  export let value = null
  export let title = "Upload file"
  export let disabled = false
  export let allowClear = null
  export let extensions = null
  export let handleFileTooLarge = null
  export let fileSizeLimit = BYTES_IN_MB * 20
  export let id = null
  export let previewUrl = null

  const fieldId = id || uuid()
  const BYTES_IN_KB = 1000
  const BYTES_IN_MB = 1000000

  const dispatch = createEventDispatcher()

  let fileInput

  $: inputAccept = Array.isArray(extensions) ? extensions.join(",") : "*"

  async function processFile(targetFile) {
    if (handleFileTooLarge && targetFile?.size >= fileSizeLimit) {
      handleFileTooLarge(targetFile)
      return
    }
    dispatch("change", targetFile)
  }

  function handleFile(evt) {
    processFile(evt.target.files[0])
  }

  function clearFile() {
    dispatch("change", null)
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
  {#if value}
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
  <ActionButton {disabled} on:click={fileInput.click()}>{title}</ActionButton>
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
