<script>
  import { Heading, Body, Button } from "../"
  import { FILE_TYPES } from "./fileTypes"

  const BYTES_IN_KB = 1000
  const BYTES_IN_MB = 1000000

  export let icons = {
    image: "fas fa-file-image",
    code: "fas fa-file-code",
    file: "fas fa-file",
    fileUpload: "fas fa-upload",
  }

  export let files = []
  export let fileSizeLimit = BYTES_IN_MB * 20
  export let processFiles
  export let handleFileTooLarge

  let selectedImageIdx = 0
  let fileDragged = false
  // Generate a random ID so that multiple dropzones on the page don't conflict
  let id = Math.random()
    .toString(36)
    .substring(7)

  $: selectedImage = files ? files[selectedImageIdx] : null

  function determineFileIcon(extension) {
    const ext = extension.toLowerCase()

    if (FILE_TYPES.IMAGE.includes(ext)) return icons.image
    if (FILE_TYPES.CODE.includes(ext)) return icons.code

    return icons.file
  }

  async function processFileList(fileList) {
    if (Array.from(fileList).some(file => file.size >= fileSizeLimit)) {
      handleFileTooLarge(fileSizeLimit, file)
      return
    }

    const processedFiles = await processFiles(fileList)

    files = [...processedFiles, ...files]
    selectedImageIdx = 0
  }

  async function removeFile() {
    files.splice(selectedImageIdx, 1)
    files = files
    selectedImageIdx = 0
  }

  function navigateLeft() {
    selectedImageIdx -= 1
  }

  function navigateRight() {
    selectedImageIdx += 1
  }

  function handleFile(evt) {
    processFileList(evt.target.files)
  }

  function handleDragOver(evt) {
    evt.preventDefault()
    fileDragged = true
  }

  function handleDragLeave(evt) {
    evt.preventDefault()
    fileDragged = false
  }

  function handleDrop(evt) {
    evt.preventDefault()
    processFileList(evt.dataTransfer.files)
    fileDragged = false
  }
</script>

<div
  class="dropzone"
  on:dragover={handleDragOver}
  on:dragleave={handleDragLeave}
  on:dragenter={handleDragOver}
  on:drop={handleDrop}
  class:fileDragged>
  {#if selectedImage}
    <ul>
      <li>
        <header>
          <div>
            <i class={determineFileIcon(selectedImage.extension)} />
            <span class="filename">{selectedImage.name}</span>
          </div>
          <p>
            {#if selectedImage.size <= BYTES_IN_MB}
              {selectedImage.size / BYTES_IN_KB}KB
            {:else}{selectedImage.size / BYTES_IN_MB}MB{/if}
          </p>
        </header>
        <div class="delete-button" on:click={removeFile}>
          <i class="ri-close-circle-fill" />
        </div>
        {#if selectedImageIdx !== 0}
          <div class="nav left" on:click={navigateLeft}>
            <i class="ri-arrow-left-circle-fill" />
          </div>
        {/if}
        <img alt="preview" src={selectedImage.url} />
        {#if selectedImageIdx !== files.length - 1}
          <div class="nav right" on:click={navigateRight}>
            <i class="ri-arrow-right-circle-fill" />
          </div>
        {/if}
      </li>
    </ul>
  {/if}
  <i class={icons.fileUpload} />
  <input {id} type="file" multiple on:change={handleFile} {...$$restProps} />
  <i class="ri-upload-cloud-line" />
  <p class="drop">Drop your files here</p>
  <label for={id}>Select a file from your computer</label>
</div>

<style>
  .dropzone {
    padding: var(--spacing-l);
    border: 2px dashed var(--grey-4);
    text-align: center;
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 10px;
    transition: all 0.3s;
  }

  .fileDragged {
    border: 2px dashed var(--grey-7);
    background: var(--blue-light);
  }

  input[type="file"] {
    display: none;
  }

  label {
    font-family: var(--font-sans);
    font-size: var(--font-size-s);
    cursor: pointer;
    overflow: hidden;
    color: var(--grey-7);
    text-rendering: optimizeLegibility;
    min-width: auto;
    outline: none;
    font-feature-settings: "case" 1, "rlig" 1, "calt" 0;
    -webkit-box-align: center;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 100%;
    text-decoration: underline;
  }

  .drop {
    font-family: var(--font-sans);
    font-size: var(--font-size-s);
    margin: 12px 0;
  }

  div.nav {
    padding: var(--spacing-xs);
    position: absolute;
    display: flex;
    align-items: center;
    bottom: var(--spacing-s);
    border-radius: 5px;
    transition: 0.2s transform;
  }

  .nav:hover {
    cursor: pointer;
    color: var(--blue);
  }

  .left {
    left: var(--spacing-s);
  }

  .right {
    right: var(--spacing-s);
  }

  li {
    position: relative;
    height: 300px;
    background: var(--grey-7);
    display: flex;
    justify-content: center;
    border-radius: 10px;
  }

  img {
    border-radius: 10px;
    width: 100%;
    box-shadow: 0 var(--spacing-s) 12px rgba(0, 0, 0, 0.15);
    object-fit: contain;
  }

  i {
    font-size: 2rem;
    color: var(--ink);
  }

  i:hover {
    cursor: pointer;
    color: var(--background);
  }

  .file-icon {
    color: var(--background);
    font-size: 2em;
    margin-right: var(--spacing-s);
  }

  ul {
    padding: 0;
    display: grid;
    grid-gap: var(--spacing-s);
    list-style-type: none;
    width: 100%;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    background: linear-gradient(
      180deg,
      rgb(255, 255, 255),
      rgba(255, 255, 255, 0)
    );
    width: 100%;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    height: 60px;
  }

  header > div {
    color: var(--ink);
    display: flex;
    align-items: center;
    font-size: 12px;
    margin-left: var(--spacing-m);
    width: 60%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .filename {
    overflow: hidden;
    margin-left: 5px;
    text-overflow: ellipsis;
  }

  header > p {
    color: var(--grey-5);
    margin-right: var(--spacing-m);
  }

  .delete-button {
    position: absolute;
    top: var(--spacing-s);
    right: var(--spacing-s);
    padding: var(--spacing-s);
    border-radius: 10px;
    transition: all 0.3s;
  }

  .delete-button i {
    font-size: 2em;
    color: var(--ink);
  }

  .delete-button:hover {
    cursor: pointer;
    color: var(--red);
  }
</style>
