<script>

export let items = [];
export let hideNavBar=false;
export let selectedItem="";
export let orientation="horizontal"; // horizontal, verical
export let alignment="left"; // start, center, end
export let pills=false;
export let fill=false;
export let _bb;

let selectedIndex = -1;
let styleVars={};
let components = {};
let componentElements = {}
let orientationClass="";
let navClasses="";

const hasComponentElements = () => 
    Object.getOwnPropertyNames(componentElements).length > 0;

$: {

    let _navClasses = "";

    if(orientation === "vertical") {
        _navClasses += " flex-column";
    } else {
        _navClasses += ` justify-content-${alignment}`;
    }

    if(pills)
        _navClasses += " nav-pills";
    
    if(fill)
        _navClasses += " nav-fill nav-justified";

    navClasses = _navClasses;

    if(items && items.length > 0 && hasComponentElements()) {
        const currentSelectedItem = selectedIndex > 0
                                   ? items[selectedIndex].title
                                   : "";
        if(selectedItem && currentSelectedItem !== selectedItem) {
            let i=0;
            for(let item of items) {
                if(item.title === selectedItem) {
                    onSelectItem(i)();
                }
                i++;
            }
        } else if(!currentSelectedItem) {
            onSelectItem(0);
        }
    }
}

const onSelectItem = (index) => () => {
    selectedIndex = index;
    if(!components[index]) {
        const comp = _bb.initialiseComponent(
            items[index].component, componentElements[index]);
        components[index] = comp;   
    }
}


</script>

<div class="root">
    {#if !hideNavBar}
    <nav class="nav {navClasses}">
        {#each items as navItem, index}
        <div class="nav-item"
             on:click={onSelectItem(index)}
             class:disabled={navItem.disabled}
             class:active={selectedIndex === index}>
            {navItem.title}
        </div>
        {/each}
    </nav>
    {/if}
    {#each items as navItem, index}

    <div class="content"
         bind:this={componentElements[index]}>
    </div>
    {/each}
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

