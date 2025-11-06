<script>
  export let width = "100"
  export let height = "100"

  const resolveNumber = value => {
    if (typeof value === "number") {
      return value
    }
    const parsed = parseFloat(value)
    return Number.isFinite(parsed) ? parsed : 18
  }

  $: dimension = Math.min(resolveNumber(width), resolveNumber(height))
  $: iconStyle = `font-size:${dimension}px;`
</script>

<span class="rest-icon" style={iconStyle}>
  <i
    class="ph ph-regular ph-webhooks-logo rest-icon__layer rest-icon__stroke"
    aria-hidden="true"
  ></i>
</span>

<style>
  .rest-icon {
    position: relative;
    display: inline-flex;
    width: 1em;
    height: 1em;
    align-items: center;
    justify-content: center;
  }

  .rest-icon__layer {
    line-height: 1;
    color: inherit;
  }

  .rest-icon__stroke {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
