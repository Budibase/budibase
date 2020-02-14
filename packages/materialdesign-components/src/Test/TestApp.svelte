<script>
  import createApp from "./createApp"
  import { props } from "./props"
  let _bb
  const {
    h1,
    overline,
    button,
    textfield,
    checkbox,
    checkboxgroup,
    radiobutton,
    radiobuttongroup,
  } = props

  let currentComponent
  let _appPromise
  $: {
    if (currentComponent) {
      const _appPromise = createApp()
      const page = {
        props: {
          _component: "testcomponents/rootComponent",
          _children: [
            h1,
            overline,
            button,
            textfield,
            checkbox,
            checkboxgroup,
            radiobutton,
            radiobuttongroup,
          ],
        },
      }
      _appPromise.then(initialise => {
        initialise(page, currentComponent, "")
      })
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
