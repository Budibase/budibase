<script>
  import { List } from "../List"
  import { MDCMenu } from "@material/menu"
  import { onMount, setContext } from "svelte"
  import createItemsStore from "../Common/ItemStore.js"

  export let onSelect = selectedItems => {}

  export let width = "400px"
  export let open = true
  export let useFixedPosition = false
  export let useAbsolutePosition = false
  //{x: number, y: number}
  export let absolutePositionCoords = null

  export let _bb

  let menu = null
  let menuList = null
  let instance = null
  let selectedItemsStore

  onMount(() => {
    _bb.setContext("BBMD:list:context", "menu")
    _bb.setContext("BBMD:list:props", { singleSelection: true })

    selectedItemsStore = createItemsStore(() => onSelect($selectedItemsStore))
    _bb.setContext("BBMD:list:selectItemStore", selectedItemsStore)

    if (!!menu) {
      instance = new MDCMenu(menu)
      instance.open = open
      if (useFixedPosition) {
        instance.setFixedPosition(true)
      } else if (useAbsolutePosition) {
        let { x, y } = absolutePositionCoords
        instance.setAbsolutePosition(x | 0, y | 0)
      }
    }
  })

  $: menuList && _bb.attachChildren(menuList)
</script>

{#if useFixedPosition || useAbsolutePosition}
  <div
    bind:this={menu}
    class="mdc-menu mdc-menu-surface"
    style={`width: ${width}`}>
    <ul bind:this={menuList} class="mdc-list" role="menu" />
  </div>
{:else}
  <div class="mdc-menu-surface--anchor">
    <!--TODO: Will automatically anchor to slotted element. Not sure how this would be achieved with Budibase though -->
    <slot />
    <div
      bind:this={menu}
      class="mdc-menu mdc-menu-surface"
      style={`width: ${width}`}>
      <ul bind:this={menuList} class="mdc-list" role="menu" />
    </div>
  </div>
{/if}
