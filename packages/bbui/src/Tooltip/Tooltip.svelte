<script>
  import "@spectrum-css/tooltip/dist/index-vars.css"

  export let direction = "top"
  export let text = ""
</script>

<span class="u-tooltip-showOnHover tooltip">
  <slot />
  <div class={`spectrum-Tooltip spectrum-Tooltip--${direction}`}>
    <span class="spectrum-Tooltip-label">{text}</span>
    <span class="spectrum-Tooltip-tip" />
  </div>
</span>
