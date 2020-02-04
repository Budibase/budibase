<script>
  export let items = []
  export let hideNavBar = false
  export let selectedItem = ""
  export let orientation = "horizontal" // horizontal, verical
  export let alignment = "start" // start, center, end
  export let pills = false
  export let fill = false
  export let className = ""
  export let _bb

  let selectedIndex = -1
  let styleVars = {}
  let components = {}
  let componentElement
  let orientationClass = ""
  let navClasses = ""
  let currentComponent
  let _selectedItem = ""

  const hasComponentElements = () =>
    Object.getOwnPropertyNames(componentElements).length > 0

  const getSelectedItemByIndex = index => (index >= 0 ? items[index].title : "")

  $: {
    let _navClasses = ""

    if (orientation === "vertical") {
      _navClasses += " flex-column"
    } else {
      _navClasses += ` justify-content-${alignment}`
    }

    if (pills) _navClasses += " nav-pills"

    if (fill) _navClasses += " nav-fill nav-justified"

    navClasses = _navClasses

    if (items && componentElement) {
      const currentSelectedItem = getSelectedItemByIndex(selectedIndex)

      if (selectedItem && currentSelectedItem !== selectedItem) {
        let i = 0
        for (let item of items) {
          if (item.title === selectedItem) {
            SelectItem(i)
          }
          i++
        }
      } else if (!selectedItem) {
        SelectItem(-1)
      }
    }
  }

  const SelectItem = index => {
    selectedIndex = index
    const newSelectedItem = getSelectedItemByIndex(index)
    if (newSelectedItem !== selectedItem) {
      selectedItem = newSelectedItem
    }

    if (currentComponent) {
      try {
        currentComponent.$destroy()
      } catch (_) {}
    }

    if (index >= 0)
      currentComponent = _bb.hydrateChildren(
        _bb.props.items[index].component,
        componentElement
      )
  }

  const onSelectItemClicked = index => () => {
    if (_bb.props.selectedItem) {
      // binding - call state, which should SelectItem(..)
      const selectedItemBinding = _bb.props.selectedItem
      _bb.setStateFromBinding(
        selectedItemBinding,
        getSelectedItemByIndex(index)
      )
    } else {
      // no binding - call this
      SelectItem(index)
    }
  }
</script>

<div class="root {className}">
  {#if !hideNavBar}
    <ul class="nav {navClasses}">
      {#each items as navItem, index}
        <li class="nav-item">
          <button
            class="nav-link btn btn-link"
            on:click={onSelectItemClicked(index)}
            class:disabled={navItem.disabled}
            class:active={selectedIndex === index}>
            {navItem.title}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
  {#each items as navItem, index}
    <div bind:this={componentElement} />
  {/each}
</div>

<style>
  .root {
    height: 100%;
    width: 100%;
  }
</style>
