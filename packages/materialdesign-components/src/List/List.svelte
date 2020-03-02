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

  export let variant = "one-line"
  //items: [{text: string | {primary: string, secondary: string}, value: any, selected: bool}...n]
  export let items = []
  export let singleSelection = false

  export let inputElement = null

  let role = "listbox"

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
      instance = new MDCList(list)
      instance.singleSelection = singleSelection
      instance.listElements.map(element => new MDCRipple(element))
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

  function handleSelectedItem(item) {
    if (!item.disabled) {
      if (singleSelection || inputElement === "radiobutton") {
        items.forEach(i => {
          if (i.selected) i.selected = false
        })
      }

      let idx = items.indexOf(item)
      if (!!item.selected) {
        items[idx].selected = !item.selected
      } else {
        items[idx].selected = true
      }
      onSelect(items.filter(item => item.selected))
    }
  }

  $: useDoubleLine =
    variant == "two-line" &&
    items.every(i => typeof i.text == "object" && "primary" in i.text)

  $: list && _bb.attachChildren(list)

  $: modifiers = { variant }
  $: props = { modifiers }
  $: listClass = cb.build({ props })
</script>

<ul bind:this={list} class={listClass} {role} />
