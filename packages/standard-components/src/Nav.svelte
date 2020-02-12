<script>
  import cssVars from "./cssVars"

  export let navBarBackground = ""
  export let navBarBorder = ""
  export let navBarColor = ""
  export let selectedItemBackground = ""
  export let selectedItemColor = ""
  export let selectedItemBorder = ""
  export let itemHoverBackground = ""
  export let itemHoverColor = ""
  export let hideNavBar = false
  export let selectedItem = ""

  export let _children
  export let _bb

  let selectedIndex = -1
  let styleVars = {}
  let components = {}
  let componentElements = {}

  const hasComponentElements = () =>
    Object.getOwnPropertyNames(componentElements).length > 0

  $: {
    styleVars = {
      navBarBackground,
      navBarBorder,
      navBarColor,
      selectedItemBackground,
      selectedItemColor,
      selectedItemBorder,
      itemHoverBackground,
      itemHoverColor,
    }

    if (_children && _children.length > 0 && hasComponentElements()) {
      const currentSelectedItem =
        selectedIndex > 0 ? _children[selectedIndex].title : ""
      if (selectedItem && currentSelectedItem !== selectedItem) {
        let i = 0
        for (let child of _children) {
          if (child.title === selectedItem) {
            onSelectItem(i)()
          }
          i++
        }
      } else if (!currentSelectedItem) {
        onSelectItem(0)
      }
    }
  }

  const onSelectItem = index => () => {
    selectedIndex = index
    if (!components[index]) {
      const comp = _bb.hydrateChildren(
        componentElements[index]
      )
      components[index] = comp
    }
  }
</script>

<div class="root" use:cssVars={styleVars}>
  {#if !hideNavBar}
    <div class="navbar">
      {#each _children as navItem, index}
        <div
          class="navitem"
          on:click={onSelectItem(index)}
          class:selected={selectedIndex === index}>
          {navItem.title}
        </div>
      {/each}
    </div>
  {/if}
  {#each _children as navItem, index}
    <div class="content" bind:this={componentElements[index]} />
  {/each}
</div>

<style>
  .root {
    height: 100%;
    width: 100%;
    grid-template-columns: [navbar] auto [content] 1fr;
    display: grid;
  }

  .navbar {
    grid-column: navbar;
    background: var(--navBarBackground);
    border: var(--navBarBorder);
    color: var(--navBarColor);
  }

  .navitem {
    padding: 10px 17px;
    cursor: pointer;
  }

  .navitem:hover {
    background: var(--itemHoverBackground);
    color: var(--itemHoverColor);
  }

  .navitem.selected {
    background: var(--selectedItemBackground);
    border: var(--selectedItemBorder);
    color: var(--selectedItemColor);
  }

  .content {
    grid-column: content;
  }
</style>
