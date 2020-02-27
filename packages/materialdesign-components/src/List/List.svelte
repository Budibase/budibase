<script>
  import { onMount, getContext } from "svelte"
  import { MDCList } from "@material/list"
  import { MDCRipple } from "@material/ripple"
  import ListItem from "./ListItem.svelte"
  import ClassBuilder from "../ClassBuilder.js"

  export let _bb
  const cb = new ClassBuilder("list", ["one-line"])

  let list = null
  let instance = null

  export let onSelect = selectedItems => {}

  export let singleSelection = false
  export let variant = "two-line"
  export let inputElement = null

  let selectedItems = []

  //TODO: Try managing selected list items with a store that is passed into context. This way can check within the component whether list item is selected to not selecteds instead of managing from internal state which is not feasible 
  function handleSelected(item) {
    let idx = selectedItems.findIndex(i => i._id === item._id)
    if (idx > -1) {
      selectedItems.splice(idx, 1)
      selectedItems = selectedItems
    } else {
      if (singleSelection) {
        selectedItems = [item]
      } else {
        selectedItems = [...selectedItems, item]
      }
    }
  }

  //See todo above
  _bb.setContext("BBMD:list:selectItem", handleSelected)

  let role = "listbox"

  onMount(() => {
    _bb.setContext("BBMD:list:props", { inputElement, variant })
    if (!!list) {
      instance = new MDCList(list)
      instance.singleSelection = singleSelection
      if (!inputElement) {
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
