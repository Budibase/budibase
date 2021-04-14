<script>
    import { getContext } from 'svelte'
    import Portal from "svelte-portal"
    export let title
    export let icon = '';
    
    const selected = getContext('tab')
</script>

<div on:click={() => $selected = title } class:is-selected={$selected === title} class="spectrum-Tabs-item" tabindex="0">
    {#if icon}
        <svg class="spectrum-Icon spectrum-Icon--sizeM" focusable="false" aria-hidden="true" aria-label="Folder">
            <use xlink:href="#spectrum-icon-18-{icon}" />
        </svg>
    {/if}
    <span class="spectrum-Tabs-itemLabel">{title}</span>
</div>
{#if $selected === title}
    <Portal target=".spectrum-Tabs-content">
        <slot />
    </Portal>
{/if}