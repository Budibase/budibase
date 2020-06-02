<script>
  import { excludeProps } from "./propertyCategories.js"
  import PropertyControl from "./PropertyControl.svelte"

  export let name = ""
  export let styleCategory = "normal"
  export let properties = []
  export let componentInstance = {}
  export let onStyleChanged = () => {}

  export let show = false

  const capitalize = name => name[0].toUpperCase() + name.slice(1)

  $: icon = show ? "ri-arrow-down-s-fill" : "ri-arrow-right-s-fill"
  $: style = componentInstance["_styles"][styleCategory] || {}
</script>

<div class="property-group-container">
  <div class="property-group-name" on:click={() => (show = !show)}>
    <div class="icon">
      <i class={icon} />
    </div>
    <div class="name">{capitalize(name)}</div>
  </div>
  <div class="property-panel" class:show>

    {#each properties as props}
      <PropertyControl
        label={props.label}
        control={props.control}
        key={props.key}
        value={style[props.key]}
        onChange={(key, value) => onStyleChanged(styleCategory, key, value)}
        props={{ ...excludeProps(props, ['control', 'label']) }} />
    {/each}
  </div>
</div>

<style>
  .property-group-container {
    display: flex;
    flex-direction: column;
    height: auto;
    background: var(--grey-light);
    margin: 0px 0px 4px 0px;
    padding: 8px 12px;
    justify-content: center;
    border-radius: 4px;
  }

  .property-group-name {
    cursor: pointer;
    display: flex;
    flex-flow: row nowrap;
  }

  .name {
    flex: 1;
    text-align: left;
    padding-top: 2px;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.14px;
    color: var(--ink);
  }

  .icon {
    flex: 0 0 20px;
    text-align: center;
  }

  .property-panel {
    /* height: 0px;
    overflow: hidden; */
    display: none;
  }

  .show {
    /* overflow: auto;
    height: auto; */
    display: flex;
    flex-direction: column;
    flex: 1;
  }
</style>
