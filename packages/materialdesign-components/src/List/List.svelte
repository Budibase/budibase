<script>
  import { onMount } from "svelte"
  import { MDCList } from "@material/list"
  import { MDCRipple } from "@material/ripple"
  import ListItem from "./ListItem.svelte"
  import ClassBuilder from "../ClassBuilder.js"

  const cb = new ClassBuilder("list")

  let list = null
  let instance = null

  export let onSelect = selectedItems => {}

  export let variant = ""
  //items: [{text: string | {primary: string, secondary: string}, value: any, selected: bool}...n]
  export let items = []
  export let singleSelection = false
  export let inputElement = null

  onMount(() => {
    if (!!list) {
      instance = new MDCList(list)
      instance.singleSelection = singleSelection
      instance.listElements.map(element => new MDCRipple(element))
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

  $: modifiers = { variant }
  $: props = { modifiers }
  $: listClass = cb.build({ props })
</script>

<div class={listClass} role="listbox">
  {#each items as item, i}
    <ListItem
      {item}
      {useDoubleLine}
      {inputElement}
      onClick={() => handleSelectedItem(item)} />
    {#if item.divider}
      <li role="separator" class="mdc-list-divider" />
    {/if}
  {/each}
</div>
