<script>
  import { FILE_TYPES } from "constants/backend"

  export let files
  export let height = "70"
  export let width = "70"
</script>

<div class="file-list">
{#each files as file}
  <div class="file">
    {#if FILE_TYPES.IMAGE.includes(file.extension)}
      <img {width} {height} src={file.clientUrl} />
    {:else}
      <i class="ri-file-line" />
      <span class="extension">.{file.extension}</span>
      <span>{file.name}</span>
    {/if}
  </div>
{/each}
</div>

<style>
  .file-list {
    display: grid;
    grid-auto-flow: column;
    grid-gap: var(--spacing-m);
    grid-template-columns: repeat(10, 1fr);
  }
  
  img {
    object-fit: contain;
  }

  i {
    font-size: 36px;
    margin-bottom: var(--spacing-m);
  }

  .file {
    position: relative;
    height: 75px;
    width: 75px;
    border: 2px dashed var(--grey-7);
    padding: var(--spacing-xl);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .extension {
    position: absolute;
    top: var(--spacing-s);
    left: var(--spacing-s);
    font-weight: 500;
  }

  span {
    width: 75px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
