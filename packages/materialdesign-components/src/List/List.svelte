<script>
  import { onMount, getContext, setContext } from "svelte"
  import { MDCList } from "@material/list"
  import createItemsStore from "../Common/ItemStore.js"
  import { MDCRipple } from "@material/ripple"
  import ListItem from "./ListItem.svelte"
  import ClassBuilder from "../ClassBuilder.js"

  let selectedItems

  export let _bb
  const cb = new ClassBuilder("list", ["one-line"])

  let list = null
  let instance = null

  export let onSelect = selectedItems => {}

  export let singleSelection = false
  export let variant = "two-line"
  export let inputElement = null

  let selectedItemsStore

  let role = "listbox"

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

    if (!_bb.getContext("BBMD:list:props")) {
      _bb.setContext("BBMD:list:props", {
        inputElement,
        variant,
        singleSelection,
      })
    }

    if (!!list) {
      if (!inputElement) {
        instance = new MDCList(list)
        instance.singleSelection = singleSelection
        instance.listElements.map(element => new MDCRipple(element))
      }
    }

    let context = getContext("BBMD:list:context")
    if (context === "menu") {
      role = "menu"
    }

    return () => {
      instance && instance.destroy()
      instance = null
    }
  })

  $: list && _bb.attachChildren(list)

  $: modifiers = { variant }
  $: props = { modifiers }
  $: listClass = cb.build({ props })
</script>

<ul bind:this={list} class={listClass} {role} />
