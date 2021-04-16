<script>
    import { getContext, onMount } from 'svelte'
    import Portal from "svelte-portal"
    export let title
    export let icon = '';
    
    const selected = getContext('tab')
    let tab;
    let tabInfo
    const setTabInfo = () => {
        tabInfo = tab.getBoundingClientRect()
        if ($selected.title === title) {
            $selected.info = tabInfo
        }
    }

    onMount(() => {
        setTabInfo()
    })

</script>

<div bind:this={tab} on:click={() => $selected = {...$selected, title, info: tab.getBoundingClientRect()} } class:is-selected={$selected.title === title} class="spectrum-Tabs-item" tabindex="0">
    {#if icon}
        <svg class="spectrum-Icon spectrum-Icon--sizeM" focusable="false" aria-hidden="true" aria-label="Folder">
            <use xlink:href="#spectrum-icon-18-{icon}" />
        </svg>
    {/if}
    <span class="spectrum-Tabs-itemLabel">{title}</span>
</div>
{#if $selected.title === title}
    <Portal target=".spectrum-Tabs-content-{$selected.id}">
        <slot />
    </Portal>
{/if}