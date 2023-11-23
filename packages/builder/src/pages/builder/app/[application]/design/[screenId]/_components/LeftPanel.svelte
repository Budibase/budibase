<script>
  import ScreenList from "./ScreenList/index.svelte"
  import ComponentList from "./ComponentList/index.svelte"
  import { getHorizontalResizeActions } from './ScreenList/resizable';

  const [resizable, resizableHandle] = getHorizontalResizeActions();
</script>

<div class="panel" use:resizable>
  <div class="content">
    <ScreenList />
    <ComponentList />
  </div>
  <div
    class="divider"
  >
    <div class="dividerClickExtender"
      role="separator"
      use:resizableHandle
     />
  </div>
</div>

<style>
  .panel {
    display: flex;
    min-width: 250px;
    width: 310px;
    height: 100%;
  }

  .content {
    overflow: scroll;
    flex-grow: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--background);
    position: relative;
  }

  .divider {
    position: relative;
    height: 100%;
    width: 2px;
    background: var(--spectrum-global-color-gray-200);
    transition: background 130ms ease-out;
  }
  .divider:hover {
    background: var(--spectrum-global-color-gray-300);
    cursor: row-resize;
  }

  .dividerClickExtender {
    position: absolute;
    cursor: row-resize;
    height: 100%;
    width: 12px;
  }
</style>
