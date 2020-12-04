<script>
  import { goto } from "@sveltech/routify"
  import api from "builderStore/api"
  import { store, backendUiStore, allScreens } from "builderStore"
  import { Input, ModalContent } from "@budibase/bbui"
  import analytics from "analytics"

  const CONTAINER = "@budibase/standard-components/container"

  let name = ""

  function save() {
    store.actions.layouts.save({
      name,
    })
  }
</script>

<ModalContent title="Create Layout" confirmText="Create" onConfirm={save}>
  <Input thin label="Name" bind:value={name} />
</ModalContent>
