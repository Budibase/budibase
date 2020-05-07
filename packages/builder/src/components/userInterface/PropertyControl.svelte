<script>
  export let label = ""
  export let control = null
  export let value = ""
  export let props = {}
  export let onChange = () => {}
</script>

<div class="property-control">
  <div class="label">{label}</div>
  <div class="control">
    <svelte:component
      this={control}
      {value}
      on:change={onChange}
      {onChange}
      {...props} />
  </div>
</div>

<style>
  .property-control {
    display: flex;
    flex-flow: row nowrap;
    margin: 8px 0px;
  }

  .label {
    flex: 0 0 50px;
    padding: 0px 5px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.12px;
    text-align: left;
  }

  .control {
    flex: 1;
    padding-left: 5px;
  }
</style>
