<script>
  import { List } from "../List";
  import { MDCMenu } from "@material/menu";
  import { onMount, setContext } from "svelte";
  export let items = [];
  export let singleSelection = true;
  export let width = "400px";
  export let open = true;
  export let useFixedPosition = false;
  export let useAbsolutePosition = false;
  //{x: number, y: number}
  export let absolutePositionCoords = null;

  let menu = null;
  let instance = null;

  onMount(() => {
    if (!!menu) {
      instance = new MDCMenu(menu);
      instance.open = open;
      if (useFixedPosition) {
        instance.setFixedPosition(true);
      } else if (useAbsolutePosition) {
        let { x, y } = absolutePositionCoords;
        instance.setAbsolutePosition(x | 0, y | 0);
      }
    }
    setContext("BBMD:list:context", "menu");
  });
</script>

{#if useFixedPosition || useAbsolutePosition}
  <div
    bind:this={menu}
    class="mdc-menu mdc-menu-surface"
    style={`width: ${width}`}>
    <List {items} {singleSelection} />
  </div>
{:else}
  <div class="mdc-menu-surface--anchor">
    <!-- Will automatically anchor to slotted element -->
    <slot />
    <div
      bind:this={menu}
      class="mdc-menu mdc-menu-surface"
      style={`width: ${width}`}>
      <List {items} {singleSelection} />
    </div>
  </div>
{/if}
