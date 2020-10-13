<script>
  import OptionSelect from "./OptionSelect.svelte"
  import { backendUiStore } from "builderStore"
  import { onMount } from "svelte"

  export let componentInstance = {}
  export let value = ""
  export let onChange = (val = {})

  const models = $backendUiStore.models

  let options = []

  $: model = componentInstance.datasource
    ? models.find(m => m._id === componentInstance.datasource.modelId)
    : null

  $: type = componentInstance.datasource.type
  $: if (model) {
    options =
      type === "model" || type === "link"
        ? Object.keys(model.schema)
        : Object.keys(model.views[componentInstance.datasource.name].schema)
  }
</script>

<OptionSelect {value} {onChange} {options} />
