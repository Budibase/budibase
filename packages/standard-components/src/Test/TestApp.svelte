<script>
  import createApp from "./createApp"
  import { form } from "./props"
  let _bb
  let currentComponent
  let _appPromise

const autoAssignIds = (props, count = 0) => {
  if (!props._id) {
    props._id = `auto_id_${count}`
  }
  if (props._children) {
    for (let child of props._children) {
      count += 1
      autoAssignIds(child, count)
    }
  }
}

  $: {
    if (currentComponent) {
      const _appPromise = createApp()
      const page = {
        props: form,
      }

      autoAssignIds(page.props)

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
