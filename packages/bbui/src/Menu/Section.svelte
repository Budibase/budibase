<script>
    export let heading
</script>
<li role="presentation">
<span class="spectrum-Menu-sectionHeading" id="menu-heading-category-1"  aria-hidden="true">{heading}</span>
    <ul class="spectrum-Menu" role="group" aria-labelledby="menu-heading-category-1">
        <slot />
    </ul>
</li>