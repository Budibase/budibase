<script>
  import { getContext } from "svelte"
  import Component from "../Component.svelte"

  export let definition
  export let settingsContext

  const { Provider, styleable } = getContext("sdk")
  const component = getContext("component")
</script>

<div use:styleable={$component.styles}>
  <Provider key="block" data={settingsContext}>
    <Component instance={definition} isBlock />
  </Provider>
</div>
