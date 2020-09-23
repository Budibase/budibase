<script>
  import { FILE_TYPES } from "./fileTypes";

  export let files
  export let height = "70"
  export let width = "70"
</script>

<div class="file-list">
  {#each files as file}
    <a href={file.url} target="_blank">
      <div class="file">
        {#if FILE_TYPES.IMAGE.includes(file.extension.toLowerCase())}
          <img {width} {height} src={file.url} />
        {:else}
          <i class="far fa-file" />
        {/if}
      </div>
      <span>{file.name}</span>
    </a>
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
    margin-bottom: var(--spacing-m);
  }

  a {
    color: var(--ink);
    text-decoration: none;
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
    width: 75px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
