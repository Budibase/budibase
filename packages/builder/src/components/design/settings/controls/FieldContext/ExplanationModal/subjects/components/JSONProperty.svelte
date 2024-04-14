<script>
  export let name;
  export let value;
</script>

<div class="property">
  <span class="propertyName">
    <slot name="name">
      {name}
    </slot>
  </span>
  <span class="propertyDivider">-</span>
  <pre class="pre propertyValue">
    <slot>
      {value}
    </slot>
  </pre>
</div>

<style>
  .property {
    margin-bottom: 12px;
  }

  .propertyName {
    font-style: italic;
  }

  .propertyDivider {
    padding: 4px;
  }

  .pre {
    margin: 0;
    margin-top: 3px;
    padding: 4px;
    border-radius: 3px;
    width: 250px;
    box-sizing: border-box;
    background-color: black;
  }
</style>
