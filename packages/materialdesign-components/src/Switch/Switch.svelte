<script>
  import ClassBuilder from "../ClassBuilder.js"
  import Formfield from "../Common/Formfield.svelte"
  import Label from "../Common/Label.svelte"
  export let onChange = checked => {}

  export let _bb
  export let alignEnd = true
  export let disabled = false
  export let checked = false
  export let label = ""
  export let id = "my-switch-component"

  const cb = new ClassBuilder("switch")

  function handleChange() {
    checked = !checked
    if (_bb.isBound(_bb.props.checked)) {
      _bb.setStateFromBinding(_bb.props.checked, checked)
    }
    _bb.call(onChange, checked)
  }

  $: modifiers = { disabled, checked }
  $: props = { modifiers }
  $: switchCls = cb.build({ props })
</script>

<Formfield {_bb} {label} {alignEnd}>
  <div class={switchCls} on:change={handleChange} style="margin: 0px 5px">
    <div class="mdc-switch__track" />
    <div class="mdc-switch__thumb-underlay">
      <div class="mdc-switch__thumb" />
      <input
        type="checkbox"
        {id}
        class="mdc-switch__native-control"
        role="switch"
        aria-checked={checked}
        {disabled}
        {checked} />
    </div>
  </div>
</Formfield>
