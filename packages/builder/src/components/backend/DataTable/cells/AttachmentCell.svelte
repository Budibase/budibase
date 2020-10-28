<script>
  import { FILE_TYPES } from "constants/backend"

  export let files
  export let height = "70"
  export let width = "70"
</script>

<div class="file-list">
  {#each files as file}
    <div class="file">
      {#if FILE_TYPES.IMAGE.includes(file.extension.toLowerCase())}
        <img {width} {height} src={file.url} />
      {:else}
        <span class="extension">.{file.extension}</span>
        <i class="ri-file-line" />
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
    font-size: 24px;
    position: relative;
    top: 5px;
  }

  .file {
    height: 75px;
    width: 75px;
    border: 2px dashed var(--grey-7);
    padding: var(--spacing-m);
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    justify-content: center;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .extension {
    position: absolute;
    top: -5px;
    font-size: var(--font-size-xs);
    font-weight: 500;
  }

  span {
    font-size: var(--font-size-xs);
    width: 75px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
