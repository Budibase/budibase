<script lang="ts">
  export let color = "currentColor"
  export let size: "S" | "M" = "M"

  const sizes = {
    S: 6,
    M: 8,
  }

  $: sizePx = sizes[size]
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox={`0 0 ${sizePx} ${sizePx}`}
  width={`${sizePx}`}
  height={`${sizePx}`}
>
  <circle
    cx={sizePx / 2}
    cy={sizePx / 2}
    r={sizePx / 2}
    stroke-width="0"
    fill={color}
  />
</svg>
