<script>
import cssVars from "./cssVars";

export let navBarBackground = "";
export let navBarBorder="";
export let navBarColor="";
export let selectedItemBackground="";
export let selectedItemColor="";
export let selectedItemBorder="";
export let itemHoverBackground="";
export let itemHoverColor="";
export let items = []

export let _bb;

let selectedIndex;
let contentElement;

$: styleVars = {
    navBarBackground, navBarBorder,
    navBarColor, selectedItemBackground,
    selectedItemColor, selectedItemBorder,
    itemHoverBackground, itemHoverColor
}

const onSelectItem = (index) => () => {
    selectedIndex = index;
    _bb.initialiseComponent(items[index].component, contentElement);
}


</script>

<div class="root" use:cssVars={styleVars}>
    <div class="navbar">
        {#each items as navItem, index}
        <div class="navitem"
             on:click={onSelectItem(index)}
             class:selected={selectedIndex === index}>
            {navItem.title}
        </div>
        {/each}
    </div>
    <div class="content"
         bind:this={contentElement}>
    </div>
</div>

<style>

.root {
    height: 100%;
    width:100%;
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

