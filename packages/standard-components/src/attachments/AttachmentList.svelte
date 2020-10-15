<script>
  import { Modal, ModalContent, Icon } from '@budibase/bbui'
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher()
  import { FILE_TYPES } from "./fileTypes"

  export let files = []
  export let height = "70"
  export let width = "70"

  let modal;
  let currentFile;

  const openModal = (file) => {
    currentFile = file
    modal.show()
  }

  const handleConfirm = () => {
    dispatch('delete', currentFile)
  }
</script>

<div class="file-list">
  {#each files as file}
    <div class="file-container">
      <a href={file.url} target="_blank" class="file">
        {#if FILE_TYPES.IMAGE.includes(file.extension.toLowerCase())}
          <img {width} {height} src={file.url} alt="preview of {file.name}" />
        {:else}<i class="far fa-file" />{/if}
      </a>
      <span>{file.name}</span>
      <div class="button-placement"><button  primary on:click={() => openModal(file)}>×</button></div>
    </div>
  {/each}
</div>
<Modal bind:this={modal}>
  <ModalContent title="Confirm File Deletion" confirmText="Delete" onConfirm={handleConfirm} >
    <span>Are you sure you want to delete this attachment?</span>
  </ModalContent>
</Modal>

<style>
  .file-list {
    display: grid;
    justify-content: start;
    grid-auto-flow: column;
    grid-gap: var(--spacing-m);
    grid-template-columns: repeat(auto-fill, 1fr);
  }

  img {
    object-fit: contain;
  }

  i {
    margin-bottom: var(--spacing-m);
  }

  a {
    color: var(--ink);
    text-decoration: none;
  }

  .file-container {
    position: relative;
  }

	button {
    display: block;
    box-sizing: border-box;
    position: absolute;
    font-size: var(--font-size-l);
    z-index: 1000;
    top: 4px;
    left: 46px;
    margin: 0;
    padding: 0;
    width: 1.5rem;
    height: 1.5rem;
    border: 0;
    color: white;
    border-radius: var(--border-radius-xl);
    background: black;
    transition: transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1),
                background 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
    -webkit-appearance: none;
    outline: none;
	}
    button:hover {
        background-color: var(--grey-8);
        cursor: pointer;
    }
    button:active {
        background-color: var(--grey-9);
        cursor: pointer;
    }

  .file {
    position: relative;
    height: 75px;
    width: 75px;
    border: 2px dashed var(--grey-7);
    padding: var(--spacing-xs);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  span {
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
