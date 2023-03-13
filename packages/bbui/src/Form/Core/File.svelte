<script>
  import ActionButton from "../../ActionButton/ActionButton.svelte"
  import { uuid } from "../../helpers"
  import Icon from "../../Icon/Icon.svelte"
  import { createEventDispatcher } from "svelte"

  export let value = null //support multi?
  export let title = "Upload file"
  export let disabled = false
  export let extensions = "*"
  export let handleFileTooLarge = null
  export let handleTooManyFiles = null
  export let fileSizeLimit = BYTES_IN_MB * 20 // Centralise
  export let id = null

  const dispatch = createEventDispatcher()

  //Is this necessary?
  const fieldId = id || uuid()

  // Centralise all in new file section?
  const BYTES_IN_KB = 1000
  const BYTES_IN_MB = 1000000

  let fileInput
  // $: file = value[0] || null

  // const imageExtensions = [
  //   "png",
  //   "tiff",
  //   "gif",
  //   "raw",
  //   "jpg",
  //   "jpeg",
  //   "svg",
  //   "bmp",
  //   "jfif",
  // ]

  // Should support only 1 file for now.
  // Files[0]

  //What is the limit? 50mb?

  async function processFileList(fileList) {
    if (
      handleFileTooLarge &&
      Array.from(fileList).some(file => file.size >= fileSizeLimit)
    ) {
      handleFileTooLarge(fileSizeLimit, value)
      return
    }

    const fileCount = fileList.length + value.length
    if (handleTooManyFiles && maximum && fileCount > maximum) {
      handleTooManyFiles(maximum)
      return
    }

    if (processFiles) {
      const processedFiles = await processFiles(fileList)
      const newValue = [...value, ...processedFiles]
      dispatch("change", newValue)
      selectedImageIdx = newValue.length - 1
    } else {
      dispatch("change", fileList)
    }
  }

  function handleFile(evt) {
    console.log("Hello ", evt.target.files[0])
    dispatch("change", evt.target.files[0])
    //processFileList(evt.target.files)
  }

  function clearFile() {
    dispatch("change", null)
  }
</script>

<input
  id={fieldId}
  {disabled}
  type="file"
  accept={extensions}
  bind:this={fileInput}
  on:change={handleFile}
/>

<div class="field">
  {#if value}
    <div class="file-view">
      <!-- <img alt="" src={value.url} /> -->
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
      {#if !disabled}
        <div class="delete-button" on:click={clearFile}>
          <Icon name="Close" size="XS" />
        </div>
      {/if}
    </div>
  {/if}
  <ActionButton on:click={fileInput.click()}>{title}</ActionButton>
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
    cursor: pointer;
  }
</style>
