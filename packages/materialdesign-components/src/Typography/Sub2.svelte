<script>
  export let text = ""
  export let verticalMargin = 5
  export let horizontalMargin = 0
</script>

<span
  style={`margin: ${verticalMargin}px ${horizontalMargin}px`}
  class="mdc-typography--subtitle2">
  {text}
</span>
