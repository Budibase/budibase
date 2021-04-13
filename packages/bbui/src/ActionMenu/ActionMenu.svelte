<script>
    import DropdownMenu from '../DropdownMenu/DropdownMenu.svelte'
    import Menu from '../Menu/Menu.svelte'
    let anchor;
    let dropdown;

    // This is needed because display: contents is considered "invisible".
    // It should only ever be an action button, so should be fine.
    function getAnchor(node) {
        anchor = node.firstChild
    }
    
    export const hide = () => { dropdown.hide() }
    export const show = () => { dropdown.show() }
</script>

<div class="contents" use:getAnchor  on:click={dropdown.show}>
    <slot name="button" />
</div>
<DropdownMenu bind:this={dropdown} {anchor} align="left">
    <Menu>
        <slot />
    </Menu>
</DropdownMenu>

<style>
    div {
        display: contents;
    }
</style>