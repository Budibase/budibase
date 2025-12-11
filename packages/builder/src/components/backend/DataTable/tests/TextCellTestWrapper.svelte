<script>
  import TextCell from "../../../../../../frontend-core/src/components/grid/cells/TextCell.svelte"

  export let value = ""
  export let focused = true
  export let readonly = false
  export let type = "text"
  export let format = null
  export let onChange = () => {}
  export let setApi

  let api

  $: if (api && setApi) {
    setApi(api)
  }
</script>

<TextCell bind:api {value} {focused} {readonly} {type} {format} {onChange} />
