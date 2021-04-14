<script>
    import "@spectrum-css/tabs/dist/index-vars.css"

    export let vertical = false
</script>
<div class="spectrum-Tabs spectrum-Tabs--{vertical ? 'vertical' : 'horizontal'}">
    <div class="spectrum-Tabs-item is-selected" tabindex="0">
        <span class="spectrum-Tabs-itemLabel">Tab 1</span>
    </div>
    <div class="spectrum-Tabs-item" tabindex="0">
        <span class="spectrum-Tabs-itemLabel">Tab 2</span>
    </div>
    <div class="spectrum-Tabs-item" tabindex="0">
        <span class="spectrum-Tabs-itemLabel">Tab 3</span>
    </div>
    <div class="spectrum-Tabs-item" tabindex="0">
        <span class="spectrum-Tabs-itemLabel">Tab 4</span>
    </div>
    <div class="spectrum-Tabs-selectionIndicator" style="width: 27px; left: 0px;"></div>
</div>