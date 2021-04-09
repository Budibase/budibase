<script>
    import "@spectrum-css/menu/dist/index-vars.css"
</script>

<ul class="spectrum-Menu" role="menu">
    <li role="presentation">
      <span class="spectrum-Menu-sectionHeading" id="menu-heading-category-1"  aria-hidden="true">Section Heading</span>
      <ul class="spectrum-Menu" role="group" aria-labelledby="menu-heading-category-1">
        <li class="spectrum-Menu-item" role="menuitem" tabindex="0">
          <span class="spectrum-Menu-itemLabel">Action 1</span>
        </li>
        <li class="spectrum-Menu-item" role="menuitem" tabindex="0">
          <span class="spectrum-Menu-itemLabel">Action 2</span>
        </li>
        <li class="spectrum-Menu-item" role="menuitem" tabindex="0">
          <span class="spectrum-Menu-itemLabel">Action 3</span>
        </li>
      </ul>
    </li>
    <li class="spectrum-Menu-divider" role="separator"></li>
    <li role="presentation">
      <span class="spectrum-Menu-sectionHeading" id="menu-heading-category-2"  aria-hidden="true">Section Heading</span>
      <ul class="spectrum-Menu" role="group" aria-labelledby="menu-heading-category-1" aria-disabled="true">
        <li class="spectrum-Menu-item" role="menuitem" tabindex="0">
          <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-Menu-itemIcon" focusable="false" aria-hidden="true" aria-label="SaveFloppy">
            <use xlink:href="#spectrum-icon-18-SaveFloppy"></use>
          </svg>
          <span class="spectrum-Menu-itemLabel">Save</span>
        </li>
        <li class="spectrum-Menu-item is-disabled" role="menuitem" aria-disabled="true">
          <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-Menu-itemIcon" focusable="false" aria-hidden="true" aria-label="DataDownload">
            <use xlink:href="#spectrum-icon-18-DataDownload"></use>
          </svg>
          <span class="spectrum-Menu-itemLabel">Download</span>
        </li>
      </ul>
    </li>
</ul>