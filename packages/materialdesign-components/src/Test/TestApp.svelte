<script>
  import createApp from "./createApp"
  import { props } from "./props"
  let _bb
  const {
    H1,
    Overline,
    Button,
    BodyBoundToStore,
    Textfield,
    Checkbox,
    Checkboxgroup,
    Radiobutton,
    Radiobuttongroup,
    Datatable,
    CustomersIndexTable,
    Icon,
    List,
    Select,
    DatePicker,
    IconButton,
    Card,
    Dialog,
    Switch,
    Slider,
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
            BodyBoundToStore,
            Textfield,
            Select,
            Radiobutton,
            Radiobuttongroup,
            DatePicker,
            IconButton,
            Switch,
            Slider,
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
