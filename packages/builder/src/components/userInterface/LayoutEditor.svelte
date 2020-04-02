<script>
  import InputGroup from "../common/Inputs/InputGroup.svelte"
  import LayoutTemplateControls from "./LayoutTemplateControls.svelte"

  export let onStyleChanged = () => {}
  export let component

  const tbrl = [
    { placeholder: "T" },
    { placeholder: "R" },
    { placeholder: "B" },
    { placeholder: "L" },
  ]

  const se = [{ placeholder: "START" }, { placeholder: "END" }]

  const single = [{ placeholder: "" }]

  $: layout = {
    ...component._styles.position,
    ...component._styles.layout,
  }

  $: layouts = {
    templaterows: ["Grid Rows", single],
    templatecolumns: ["Grid Columns", single],
  }

  $: display = {
    direction: ["Direction", single],
    align: ["Align", single],
    justify: ["Justify", single],
  }

  $: positions = {
    column: ["Column", se],
    row: ["Row", se],
  }

  $: spacing = {
    margin: ["Margin", tbrl, "small"],
    padding: ["Padding", tbrl, "small"],
  }

  $: size = {
    height: ["Height", single],
    width: ["Width", single],
  }

  $: zindex = {
    zindex: ["Z-Index", single],
  }

  const newValue = n => Array(n).fill("")
</script>

<h3>Layout</h3>
<div class="layout-pos">
  {#each Object.entries(display) as [key, [name, meta, size]] (component._id + key)}
    <div class="grid">
      <h5>{name}:</h5>
      <LayoutTemplateControls
        onStyleChanged={_value => onStyleChanged('layout', key, _value)}
        values={layout[key] || newValue(meta.length)}
        propertyName={name}
        {meta}
        {size}
        type="text" />
    </div>
  {/each}
</div>

<!-- <h4>Positioning</h4>
<div class="layout-pos">
  {#each Object.entries(positions) as [key, [name, meta, size]] (component._id + key)}
    <div class="grid">
      <h5>{name}:</h5>
      <InputGroup
        onStyleChanged={_value => onStyleChanged('position', key, _value)}
        values={layout[key] || newValue(meta.length)}
        {meta}
        {size} />
    </div>
  {/each}
</div> -->

<h3>Spacing</h3>
<div class="layout-spacing">
  {#each Object.entries(spacing) as [key, [name, meta, size]] (component._id + key)}
    <div class="grid">
      <h5>{name}:</h5>
      <InputGroup
        onStyleChanged={_value => onStyleChanged('position', key, _value)}
        values={layout[key] || newValue(meta.length)}
        {meta}
        {size}
        type="text" />
    </div>
  {/each}
</div>

<h3>Size</h3>
<div class="layout-layer">
  {#each Object.entries(size) as [key, [name, meta, size]] (component._id + key)}
    <div class="grid">
      <h5>{name}:</h5>
      <InputGroup
        onStyleChanged={_value => onStyleChanged('position', key, _value)}
        values={layout[key] || newValue(meta.length)}
        type="text"
        {meta}
        {size} />
    </div>
  {/each}
</div>

<h3>Order</h3>
<div class="layout-layer">
  {#each Object.entries(zindex) as [key, [name, meta, size]] (component._id + key)}
    <div class="grid">
      <h5>{name}:</h5>
      <InputGroup
        onStyleChanged={_value => onStyleChanged('position', key, _value)}
        values={layout[key] || newValue(meta.length)}
        {meta}
        {size} />
    </div>
  {/each}
</div>

<style>
  h3 {
    text-transform: uppercase;
    font-size: 13px;
    font-weight: 700;
    color: #000333;
    opacity: 0.6;
    margin-bottom: 10px;
  }

  h4 {
    text-transform: uppercase;
    font-size: 10px;
    font-weight: 600;
    color: #000333;
    opacity: 0.4;
    letter-spacing: 1px;
    margin-bottom: 10px;
  }

  h5 {
    font-size: 13px;
    font-weight: 400;
    color: #000333;
    opacity: 0.8;
    padding-top: 13px;
    margin-bottom: 0;
  }

  div > div {
    display: grid;
    grid-template-rows: 1fr;
    grid-gap: 10px;
    height: 40px;
    margin-bottom: 15px;
  }

  .grid {
    grid-template-columns: 70px 2fr;
  }
</style>
