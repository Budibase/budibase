<script>
  import { notifier } from "builderStore/store/notifications"
  import { Heading, Body, Button } from "@budibase/bbui"
  import { FILE_TYPES } from "constants/backend"
  import api from "builderStore/api"

  const BYTES_IN_KB = 1000
  const BYTES_IN_MB = 1000000

  export let files = []
  export let fileSizeLimit = BYTES_IN_MB * 20

  let selectedImageIdx = 0
  let fileDragged = false

  $: selectedImage = files[selectedImageIdx]

  function determineFileIcon(extension) {
    const ext = extension.toLowerCase()

    if (FILE_TYPES.IMAGE.includes(ext)) return "ri-image-2-line"
    if (FILE_TYPES.CODE.includes(ext)) return "ri-terminal-box-line"

    return "ri-file-line"
  }

  async function processFiles(fileList) {
    const fileArray = Array.from(fileList)

    if (fileArray.some(file => file.size >= fileSizeLimit)) {
      notifier.danger(
        `Files cannot exceed ${fileSizeLimit /
          BYTES_IN_MB}MB. Please try again with smaller files.`
      )
      return
    }

    const filesToProcess = fileArray.map(({ name, path, size }) => ({
      name,
      path,
      size,
    }))

    const response = await api.post(`/api/attachments/process`, {
      files: filesToProcess,
    })
    const processedFiles = await response.json()
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
    processFiles(evt.target.files)
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
    processFiles(evt.dataTransfer.files)
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
  <ul>
    {#if selectedImage}
      <li>
        <header>
          <div>
            <i
              class={`file-icon ${determineFileIcon(selectedImage.extension)}`} />
            <span class="filename">{selectedImage.name}</span>
          </div>
          <p>
            {#if selectedImage.size <= BYTES_IN_MB}
              {selectedImage.size / BYTES_IN_KB}KB
            {:else}{selectedImage.size / BYTES_IN_MB}MB{/if}
          </p>
        </header>
        <div class="delete-button" on:click={removeFile}>
          <i class="ri-close-line" />
        </div>
        {#if selectedImageIdx !== 0}
          <div class="nav left" on:click={navigateLeft}>
            <i class="ri-arrow-left-line" />
          </div>
        {/if}
        <img src={selectedImage.url} />
        {#if selectedImageIdx !== files.length - 1}
          <div class="nav right" on:click={navigateRight}>
            <i class="ri-arrow-right-line" />
          </div>
        {/if}
      </li>
    {/if}
  </ul>
  <i class="ri-folder-upload-line" />
  <input id="file-upload" type="file" multiple on:change={handleFile} />
  <label for="file-upload">Upload</label>
</div>

<style>
  .dropzone {
    padding: var(--spacing-l);
    border: 2px dashed var(--grey-7);
    text-align: center;
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 10px;
    transition: all 0.3s;
  }

  .fileDragged {
    border: 2px dashed var(--grey-7);
    transform: scale(1.03);
    background: var(--blue-light);
  }

  input[type="file"] {
    display: none;
  }

  label {
    font-family: var(--font-sans);
    cursor: pointer;
    font-weight: 600;
    box-sizing: border-box;
    overflow: hidden;
    border-radius: var(--border-radius-s);
    color: var(--white);
    padding: var(--spacing-s) var(--spacing-l);
    transition: all 0.2s ease 0s;
    display: inline-flex;
    text-rendering: optimizeLegibility;
    min-width: auto;
    outline: none;
    font-feature-settings: "case" 1, "rlig" 1, "calt" 0;
    -webkit-box-align: center;
    user-select: none;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    width: 100%;
    border: solid 1.5px var(--ink);
    background-color: var(--ink);
  }

  div.nav {
    position: absolute;
    background: black;
    color: var(--white);
    display: flex;
    align-items: center;
    bottom: var(--spacing-s);
    border-radius: 10px;
    transition: 0.2s transform;
  }

  .nav:hover {
    cursor: pointer;
    transform: scale(1.1);
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
    font-size: 3em;
  }

  .file-icon {
    color: var(--white);
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
      rgba(12, 12, 12, 1),
      rgba(60, 60, 60, 0)
    );
    width: 100%;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    height: 60px;
  }

  header > div {
    color: var(--white);
    display: flex;
    align-items: center;
    font-size: 15px;
    margin-left: var(--spacing-m);
    width: 60%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .filename {
    overflow: hidden;
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
    opacity: 0;
    transition: all 0.3s;
    color: var(--white);
  }

  .delete-button i {
    font-size: 2em;
  }

  .delete-button:hover {
    opacity: 1;
    cursor: pointer;
    background: linear-gradient(
      to top right,
      rgba(60, 60, 60, 0),
      rgba(255, 0, 0, 0.2)
    );
  }
</style>
