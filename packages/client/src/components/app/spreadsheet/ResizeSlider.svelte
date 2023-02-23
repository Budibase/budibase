<script>
  import { getContext } from "svelte"

  export let columnIdx

  const { resize } = getContext("spreadsheet")
</script>

<div on:mousedown={e => resize.actions.startResizing(columnIdx, e)} />

<style>
  div {
    position: absolute;
    top: 0;
    right: 0;
    width: 16px;
    height: 100%;
  }
  div:after {
    opacity: 0;
    content: " ";
    position: absolute;
    width: 4px;
    right: 0;
    top: 0;
    height: 100%;
    background: var(--spectrum-global-color-gray-600);
    transition: opacity 130ms ease-out;
  }
  div:hover {
    cursor: col-resize;
  }
  div:hover:after {
    opacity: 1;
  }
</style>
