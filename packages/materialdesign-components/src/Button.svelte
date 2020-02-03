<script>
  import "@material/button/mdc-button.scss"
  export let raised = false

  let c = raised ? "mdc-button mdc-button--raised" : "mdc-button"
</script>

<button class={c}>
  <div class="mdc-button__ripple" />

  <span class="mdc-button__label">Button</span>
</button>
