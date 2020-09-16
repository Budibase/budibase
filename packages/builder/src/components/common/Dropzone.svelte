<script>
  import { Heading, Body, Button } from "@budibase/bbui"
  import api from "builderStore/api"
  import { fade } from "svelte/transition"

  export let files = []

  let selectedImageIdx = 0
  let fileDragged = false

  $: selectedImage = files[selectedImageIdx]

  async function processFiles(fileList) {
    const filesToProcess = Array.from(fileList).map(({ name, path, size }) => ({
      name,
      path,
      size,
    }))

    const response = await api.post(`/api/files/process`, {
      files: filesToProcess,
    })
    const processedFiles = await response.json()
    files = [...processedFiles, ...files]
  }

  function navigateLeft() {
    if (selectedImageIdx === 0) return
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
      <li transition:fade>
        <header>
          <span>
            <i class="ri-image-2-line file-icon" />
            {selectedImage.extension}
          </span>
          <p>{selectedImage.size / 1000}KB</p>
        </header>
        {#if selectedImageIdx !== 0}
          <div class="nav left" on:click={navigateLeft}>
            <i class="ri-arrow-left-line" />
          </div>
        {/if}
        <img src={selectedImage.clientUrl} />
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
    transition: all 0.2s;
  }

  .fileDragged {
    border: 2px dashed var(--grey-7);
    transform: scale(1.02);
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
    bottom: 5px;
    border-radius: 10px;
    transition: 0.2s transform;
  }

  .nav:hover {
    cursor: pointer;
    transform: scale(1.1);
  }

  .left {
    left: 5px;
  }

  .right {
    right: 5px;
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
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
    object-fit: contain;
  }

  i {
    font-size: 3em;
  }

  .file-icon {
    color: var(--white);
    font-size: 2em;
    margin-right: 5px;
  }

  ul {
    padding: 0;
    display: grid;
    grid-gap: 5px;
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

  header span {
    color: var(--white);
    display: flex;
    align-items: center;
    font-size: 15px;
    margin-left: var(--spacing-m);
  }

  header p {
    color: var(--grey-5);
    margin-right: var(--spacing-m);
  }
</style>
