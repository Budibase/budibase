<script>
  import { onMount } from "svelte"
  import { MDCSelect } from "@material/select"
  import { generate } from "shortid"

  import HelperText from "./HelperText.svelte"
  import NotchedOutline from "../Common/NotchedOutline.svelte"
  import FloatingLabel from "../Common/FloatingLabel.svelte"
  import createItemsStore from "../Common/ItemStore.js"
  import ClassBuilder from "../ClassBuilder.js"

  const cb = new ClassBuilder("select", ["filled"])

  let selectedItemsStore

  let select
  let selectList
  let instance
  let _helperId = ""
  // let listItems = []

  export let _bb
  export let onSelect = items => {}
  export let width = "400px"
  export let variant = "filled"
  export let disabled = false
  export let required = false
  export let label = ""
  export let helperText = ""
  export let persistent = false
  export let value = ""

  $: safeValue = Array.isArray(value) ? value : [value]

  onMount(() => {
    _bb.setContext("BBMD:list:props", { singleSelection: true })

    //May not be necessary as state binds from value below. Commenting for now.
    // _bb.setContext("BBMD:list:addItem", i => (listItems = [...listItems, i]))

    selectedItemsStore = createItemsStore(() => {
      const v =
        $selectedItemsStore && $selectedItemsStore.length > 0
          ? $selectedItemsStore[0].value
          : ""

      value = v
      _bb.setStateFromBinding(_bb.props.value, v)
      _bb.call(onSelect, v)
    }, safeValue)

    _bb.setContext("BBMD:list:selectItemStore", selectedItemsStore)

    _helperId = generate()

    if (!!select) {
      instance = new MDCSelect(select)
      return () => {
        instance && instance.destroy()
        instance = null
      }
    }
  })

  $: useNotchedOutline = variant === "outlined"
  $: selectList && _bb.attachChildren(selectList)

  $: modifiers = { variant, disabled, required, noLabel: !label }
  $: props = { modifiers }
  $: selectClass = cb.build({ props })
  // $: if (value !== undefined && instance && listItems.length > 0) {
  //   instance.selectedIndex = listItems.findIndex(i => i.value === value)
  // }
</script>

<div bind:this={select} id={_helperId} class={selectClass}>
  <div class="mdc-select__anchor" style={`width: ${width}`}>
    <i class="mdc-select__dropdown-icon" />
    <div
      id={_helperId}
      class="mdc-select__selected-text"
      aria-required={required}
      aria-controls={_helperId}
      aria-describedby={_helperId} />

    {#if useNotchedOutline}
      <NotchedOutline>
        <FloatingLabel text={label} />
      </NotchedOutline>
    {:else}
      <FloatingLabel text={label} />
      <div class="mdc-line-ripple" />
    {/if}

  </div>

  <div
    class="mdc-select__menu mdc-menu mdc-menu-surface"
    role="listbox"
    style={`width: ${width}`}>

    <ul bind:this={selectList} class="mdc-list" />

  </div>
</div>
<HelperText id={_helperId} text={helperText} {persistent} />
