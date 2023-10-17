<script>
  // This component is overridden when running in a real app.
  // This simply serves as a placeholder component for the real screen router
  import { getContext } from "svelte"

  const { styleable } = getContext("sdk")
  const component = getContext("component")
</script>

<div use:styleable={{ ...$component.styles, empty: true }}>
  <h1>Screen Slot</h1>
  <span>
    The screens that you create will be displayed inside this box.
    <br />
    This box is just a placeholder, to show you the position of screens.
  </span>
</div>

<style>
  div {
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: center !important;
    padding: 32px !important;
    text-align: center !important;
  }
  h1 {
    color: var(--spectrum-alias-text-color);
  }
  span {
    font-size: var(--font-size-s);
    color: var(--spectrum-global-color-gray-600);
  }
</style>
