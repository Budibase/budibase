<script>
  export let name
  export let value
  export let truncate = false
</script>

<div class:truncate class="property">
  <span class="propertyName">
    <slot name="name">
      {name}
    </slot>
  </span>
  <span class="propertyDivider">-</span>
  <span class="propertyValue">
    <slot>
      {value}
    </slot>
  </span>
</div>

<style>
  .property {
    max-width: 100%;
    margin-bottom: 8px;
  }

  .truncate {
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .propertyName {
    font-weight: 600;
    flex-shrink: 0;
  }

  .propertyDivider {
    padding: 0 4px;
    flex-shrink: 0;
  }

  .propertyValue {
    word-break: break-word;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
