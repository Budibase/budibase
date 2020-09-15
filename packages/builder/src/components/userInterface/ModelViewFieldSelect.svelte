<script>
  import OptionSelect from "./OptionSelect.svelte"
  import { backendUiStore } from "builderStore"
  import { onMount } from "svelte"

  export let componentInstance = {}
  export let value = ""
  export let onChange = (val = {})

  const models = $backendUiStore.models

  let options = []

  $: model = componentInstance.datasource ? models.find(m => m._id === componentInstance.datasource.modelId) : null

  $: if (model) {
    options = componentInstance.datasource.isModel
      ? Object.keys(model.schema)
      : Object.keys(model.views[componentInstance.datasource.name].schema)
  }
</script>

<OptionSelect {value} {onChange} {options} />
