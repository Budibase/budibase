<script>
    export let icon = undefined;
    export let disabled = undefined;
</script>

<li on:click|preventDefault class="spectrum-Menu-item" class:is-disabled={disabled} role="menuitem" tabindex="0">
    <span class="spectrum-Menu-itemLabel">
        {#if icon}
            <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-Menu-itemIcon" focusable="false" aria-hidden="true" aria-label={icon}>
                <use xlink:href="#spectrum-icon-18-{icon}"></use>
            </svg>
        {/if}
        <span class="spectrum-Menu-itemLabel"><slot /></span>
    </span>
</li>