<script>
  import createApp from "./createApp"
  import { props } from "./props"

  let _bb

  const _appPromise = createApp()
  _appPromise.then(a => (_bb = a))

  const { h1, overline, button, textfield } = props

  let currentComponent

  $: {
    if (_bb && currentComponent) {
      _bb.hydrateChildren([h1, overline, button, textfield], currentComponent)
    }
  }
</script>

{#await _appPromise}
  loading
{:then _bb}

  <div id="current_component" bind:this={currentComponent} />

{/await}

<style>
  #current_component {
    height: 100%;
    width: 100%;
  }
</style>
