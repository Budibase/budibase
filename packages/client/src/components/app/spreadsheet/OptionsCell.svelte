<script>
  export let value
  export let schema

  const colors = [
    "rgb(207, 223, 255)",
    "rgb(208, 240, 253)",
    "rgb(194, 245, 233)",
    "rgb(209, 247, 196)",
    "rgb(255, 234, 182)",
    "rgb(254, 226, 213)",
    "rgb(255, 220, 229)",
    "rgb(255, 218, 246)",
    "rgb(237, 226, 254)",
  ]

  $: idx = schema?.constraints?.inclusion?.indexOf(value)
  $: color = value && idx === -1 ? null : colors[idx % colors.length]
</script>

<div style="--color: {color}" class:valid={!!color}>
  {value || ""}
</div>

<style>
  div {
    padding: 0 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  div.valid {
    margin: 0 8px;
    padding: 2px 8px;
    background: var(--color);
    border-radius: 8px;
    color: #333;
  }
</style>
