<script>
  import { List } from "../List"
  import { MDCMenu } from "@material/menu"
  import { onMount, setContext } from "svelte"
  import createItemsStore from "../Common/ItemStore.js"

  export let onSelect = selectedItems => {}

  export let singleSelection = true
  export let width = "400px"
  export let open = true
  export let useFixedPosition = false
  export let useAbsolutePosition = false
  //{x: number, y: number}
  export let absolutePositionCoords = null

  export let _bb

  let menu = null
  let instance = null
  let selectedItemsStore

  function createOrAcceptItemStore() {
    let store = _bb.getContext("BBMD:list:selectItemStore")
    if (!!store) {
      selectedItemsStore = store
    } else {
      selectedItemsStore = createItemsStore(() => onSelect($selectedItemsStore))
      _bb.setContext("BBMD:list:selectItemStore", selectedItemsStore)
    }
  }

  onMount(() => {
    createOrAcceptItemStore()

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
    setContext("BBMD:list:context", "menu")
  })

  $: menu && _bb.attachChildren(menu)
</script>

{#if useFixedPosition || useAbsolutePosition}
  <div
    bind:this={menu}
    class="mdc-menu mdc-menu-surface"
    style={`width: ${width}`}>
    <List {singleSelection} {_bb} />
  </div>
{:else}
  <div class="mdc-menu-surface--anchor">
    <!-- Will automatically anchor to slotted element -->
    <slot />
    <div
      bind:this={menu}
      class="mdc-menu mdc-menu-surface"
      style={`width: ${width}`}>
      <List {singleSelection} {_bb} />
    </div>
  </div>
{/if}
