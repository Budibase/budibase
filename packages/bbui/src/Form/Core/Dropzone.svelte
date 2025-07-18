<script lang="ts">
  import "@spectrum-css/dropzone/dist/index-vars.css"
  import "@spectrum-css/typography/dist/index-vars.css"
  import "@spectrum-css/illustratedmessage/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"
  import { uuid } from "../../helpers"
  import Icon from "../../Icon/Icon.svelte"
  import Link from "../../Link/Link.svelte"
  import Tag from "../../Tags/Tag.svelte"
  import Tags from "../../Tags/Tags.svelte"
  import ProgressCircle from "../../ProgressCircle/ProgressCircle.svelte"
  import type { UIFile } from "@budibase/types"

  const BYTES_IN_KB = 1000
  const BYTES_IN_MB = 1000000

  export let value: UIFile[] | File[] = []
  export let id: string | null = null
  export let disabled: boolean = false
  export let compact: boolean = false
  export let fileSizeLimit: number = BYTES_IN_MB * 20
  export let processFiles: ((_files: FileList) => Promise<UIFile[]>) | null =
    null
  export let deleteAttachments: ((_keys: string[]) => Promise<void>) | null =
    null
  export let handleFileTooLarge:
    | ((_limit: number, _currentFiles: UIFile[] | File[]) => void)
    | null = null
  export let handleTooManyFiles: ((_maximum: number) => void) | null = null
  export let gallery: boolean = true
  export let fileTags: string[] = []
  export let maximum: number | undefined = undefined
  export let extensions: string = "*"
  export let titleText: string | null = null
  export let clickText: string | null = null
  export let addText: string | null = null

  const dispatch = createEventDispatcher<{ change: UIFile[] | File[] }>()
  const imageExtensions = [
    "png",
    "tiff",
    "gif",
    "raw",
    "jpg",
    "jpeg",
    "svg",
    "bmp",
    "jfif",
    "webp",
  ]
  const fieldId = id || uuid()

  let selectedImageIdx = 0
  let fileDragged = false
  let selectedUrl: string | undefined
  let fileInput: HTMLInputElement
  let loading = false

  $: selectedImage = value?.[selectedImageIdx] ?? null
  $: fileCount = value?.length ?? 0
  $: isImage =
    (selectedImage &&
      "extension" in selectedImage &&
      imageExtensions.includes(selectedImage?.extension?.toLowerCase())) ||
    selectedImage?.type?.startsWith("image")

  $: {
    if (selectedImage && "url" in selectedImage && selectedImage?.url) {
      selectedUrl = selectedImage?.url
    } else if (selectedImage && isImage) {
      try {
        let reader = new FileReader()
        reader.readAsDataURL(selectedImage as any)
        reader.onload = e => {
          selectedUrl = e.target?.result as string
        }
      } catch (error) {
        selectedUrl = undefined
      }
    }
  }

  $: showDropzone =
    (!maximum || (maximum && (value?.length || 0) < maximum)) && !disabled

  async function processFileList(fileList: FileList) {
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
      loading = true
      try {
        const processedFiles = await processFiles(fileList)
        const newValue = [...(value as UIFile[]), ...processedFiles]
        dispatch("change", newValue)
        selectedImageIdx = newValue.length - 1
      } finally {
        loading = false
      }
    } else {
      dispatch("change", Array.from(fileList))
    }
  }

  async function removeFile() {
    dispatch(
      "change",
      value.filter((_x, idx) => idx !== selectedImageIdx) as UIFile[] | File[]
    )
    if (deleteAttachments) {
      await deleteAttachments(
        value
          .filter((_x, idx) => idx === selectedImageIdx)
          .map(item => ("key" in item && item.key) || "")
      )
      fileInput.value = ""
    }
    selectedImageIdx = 0
  }

  function navigateLeft() {
    selectedImageIdx -= 1
  }

  function navigateRight() {
    selectedImageIdx += 1
  }

  function handleFile(evt: Event) {
    const target = evt.target as HTMLInputElement

    if (target?.files) {
      processFileList(target.files)
    }
  }

  function handleDragOver(evt: DragEvent) {
    evt.preventDefault()
    fileDragged = true
  }

  function handleDragLeave(evt: DragEvent) {
    evt.preventDefault()
    fileDragged = false
  }

  function handleDrop(evt: DragEvent) {
    evt.preventDefault()
    if (evt.dataTransfer?.files) {
      processFileList(evt.dataTransfer.files)
    }
    fileDragged = false
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div class="container" class:compact>
  {#if selectedImage}
    {#if gallery}
      <div class="gallery">
        <div class="title">
          <div class="filename">
            {#if selectedUrl}
              <Link
                target="_blank"
                download={selectedImage.name}
                href={selectedUrl}
              >
                {selectedImage.name}
              </Link>
            {:else}
              {selectedImage.name}
            {/if}
          </div>
          {#if selectedImage.size}
            <div class="filesize">
              {#if selectedImage.size <= BYTES_IN_MB}
                {`${(selectedImage.size / BYTES_IN_KB).toFixed(1)} KB`}
              {:else}{`${(selectedImage.size / BYTES_IN_MB).toFixed(
                  1
                )} MB`}{/if}
            </div>
          {/if}
          {#if !disabled}
            <div class="delete-button" on:click={removeFile}>
              <Icon name="trash" />
            </div>
          {/if}
        </div>
        {#if isImage}
          <img alt="preview" src={selectedUrl} />
        {:else}
          <div class="placeholder">
            <div class="extension">
              {selectedImage.name || "Unknown file"}
            </div>
            <div>Preview not supported</div>
          </div>
        {/if}
        <div
          class="nav left"
          class:visible={selectedImageIdx > 0}
          on:click={navigateLeft}
        >
          <Icon name="caret-left" />
        </div>
        <div
          class="nav right"
          class:visible={selectedImageIdx < fileCount - 1}
          on:click={navigateRight}
        >
          <Icon name="caret-right" />
        </div>
        {#if maximum !== 1}
          <div class="footer">File {selectedImageIdx + 1} of {fileCount}</div>
        {/if}
      </div>
    {:else if value?.length}
      {#each value as file}
        <div class="gallery">
          <div class="title">
            <div class="filename">{file.name}</div>
            {#if file.size}
              <div class="filesize">
                {#if file.size <= BYTES_IN_MB}
                  {`${(file.size / BYTES_IN_KB).toFixed(1)} KB`}
                {:else}{`${(file.size / BYTES_IN_MB).toFixed(1)} MB`}{/if}
              </div>
            {/if}
            {#if !disabled}
              <div class="delete-button" on:click={removeFile}>
                <Icon name="trash" />
              </div>
            {/if}
          </div>
        </div>
      {/each}
    {/if}
  {/if}
  {#if showDropzone}
    <div
      class="spectrum-Dropzone"
      class:disabled={disabled || loading}
      role="region"
      tabindex="0"
      on:dragover={handleDragOver}
      on:dragleave={handleDragLeave}
      on:dragenter={handleDragOver}
      on:drop={handleDrop}
      class:is-dragged={fileDragged}
    >
      <div class="spectrum-IllustratedMessage spectrum-IllustratedMessage--cta">
        <input
          id={fieldId}
          {disabled}
          type="file"
          multiple={maximum !== 1}
          accept={extensions}
          bind:this={fileInput}
          on:change={handleFile}
        />
        {#if !compact}
          <svg
            class="spectrum-IllustratedMessage-illustration"
            width="125"
            height="60"
            viewBox="0 0 199 97.7"
          >
            <defs>
              <style>
                .cls-1,
                .cls-2 {
                  fill: none;
                  stroke-linecap: round;
                  stroke-linejoin: round;
                }
                .cls-1 {
                  stroke-width: 3px;
                }
                .cls-2 {
                  stroke-width: 2px;
                }
              </style>
            </defs>
            <path
              class="cls-1"
              d="M110.53,85.66,100.26,95.89a1.09,1.09,0,0,1-1.52,0L88.47,85.66"
            />
            <line class="cls-1" x1="99.5" y1="95.5" x2="99.5" y2="58.5" />
            <path class="cls-1" d="M105.5,73.5h19a2,2,0,0,0,2-2v-43" />
            <path
              class="cls-1"
              d="M126.5,22.5h-19a2,2,0,0,1-2-2V1.5h-31a2,2,0,0,0-2,2v68a2,2,0,0,0,2,2h19"
            />
            <line class="cls-1" x1="105.5" y1="1.5" x2="126.5" y2="22.5" />
            <path
              class="cls-2"
              d="M47.93,50.49a5,5,0,1,0-4.83-5A4.93,4.93,0,0,0,47.93,50.49Z"
            />
            <path
              class="cls-2"
              d="M36.6,65.93,42.05,60A2.06,2.06,0,0,1,45,60l12.68,13.2"
            />
            <path
              class="cls-2"
              d="M3.14,73.23,22.42,53.76a1.65,1.65,0,0,1,2.38,0l19.05,19.7"
            />
            <path
              class="cls-1"
              d="M139.5,36.5H196A1.49,1.49,0,0,1,197.5,38V72A1.49,1.49,0,0,1,196,73.5H141A1.49,1.49,0,0,1,139.5,72V32A1.49,1.49,0,0,1,141,30.5H154a2.43,2.43,0,0,1,1.67.66l6,5.66"
            />
            <rect
              class="cls-1"
              x="1.5"
              y="34.5"
              width="58"
              height="39"
              rx="2"
              ry="2"
            />
          </svg>
          <h2
            class="spectrum-Heading spectrum-Heading--sizeL spectrum-Heading--light spectrum-IllustratedMessage-heading"
          >
            {titleText || "Drag and drop your file"}
          </h2>
        {/if}
        {#if !disabled}
          <p
            class="spectrum-Body spectrum-Body--sizeS spectrum-IllustratedMessage-description"
          >
            <label for={fieldId} class="spectrum-Link">
              {clickText || "Click to select a file"}
            </label>
            {#if !compact}
              <br />
              {addText || "or drop it here"}
            {/if}
          </p>
          {#if fileTags.length}
            <Tags>
              <div class="tags">
                {#each fileTags as tag}
                  <div class="tag">
                    <Tag>
                      {tag}
                    </Tag>
                  </div>
                {/each}
              </div>
            </Tags>
          {/if}
        {/if}
      </div>

      {#if loading}
        <div class="loading">
          <ProgressCircle size="M" />
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .container {
    --spectrum-dropzone-padding: var(--spectrum-global-dimension-size-400);
    --spectrum-heading-l-text-size: var(
      --spectrum-global-dimension-font-size-400
    );
  }

  .gallery,
  .spectrum-Dropzone {
    user-select: none;
  }
  input[type="file"] {
    display: none;
  }
  .compact .spectrum-Dropzone {
    padding: 6px 0 !important;
  }

  .gallery {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    background-color: var(--spectrum-global-color-gray-50);
    color: var(--spectrum-alias-text-color);
    font-size: var(--spectrum-alias-item-text-size-m);
    box-sizing: border-box;
    border: var(--spectrum-alias-border-size-thin)
      var(--spectrum-alias-border-color) solid;
    border-radius: var(--spectrum-alias-border-radius-regular);
    padding: 10px;
    margin-bottom: 10px;
    position: relative;
  }
  .placeholder,
  img {
    height: 120px;
    max-width: 100%;
    object-fit: contain;
    margin: 20px 30px;
  }
  .compact .placeholder,
  .compact img {
    margin: 8px 16px;
  }
  .compact img {
    height: 90px;
  }
  .compact .gallery {
    padding: 6px 10px;
    margin-bottom: 8px;
  }

  .compact .placeholder {
    height: fit-content;
  }

  .title {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .filename {
    flex: 1 1 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 0;
    margin-right: 10px;
    user-select: all;
  }
  .placeholder {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .extension {
    color: var(--spectrum-global-color-gray-600);
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 5px;
    user-select: all;
  }

  .nav {
    padding: var(--spacing-xs);
    position: absolute;
    top: 50%;
    border-radius: 5px;
    display: none;
    transition: all 0.3s;
  }
  .nav.visible {
    display: block;
  }
  .nav:hover {
    cursor: pointer;
    color: var(--blue);
  }
  .left {
    left: 5px;
  }
  .right {
    right: 5px;
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

  .spectrum-Dropzone {
    height: 220px;
    position: relative;
  }
  .compact .spectrum-Dropzone {
    height: 40px;
  }
  .spectrum-Dropzone.disabled {
    pointer-events: none;
    background-color: var(--spectrum-global-color-gray-200);
  }
  .disabled .spectrum-Heading--sizeL {
    color: var(--spectrum-alias-text-color-disabled);
  }
  .compact .spectrum-IllustratedMessage-description {
    margin: 0;
  }

  .tags {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .tag {
    margin-top: 8px;
  }

  .loading {
    position: absolute;
    display: grid;
    place-items: center;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
  }
</style>
