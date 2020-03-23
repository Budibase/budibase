<script>
  export let text = ""
  export let verticalMargin = 0
  export let horizontalMargin = 0
</script>

<span
  style={`margin: ${verticalMargin}px ${horizontalMargin}px`}
  class="mdc-typography--overline">
  {text}
</span>
