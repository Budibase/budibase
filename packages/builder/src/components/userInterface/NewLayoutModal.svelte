<script>
  import { goto } from "@sveltech/routify"
  import api from "builderStore/api"
  import { notifier } from "builderStore/store/notifications"
  import { store, backendUiStore, allScreens } from "builderStore"
  import { Input, ModalContent } from "@budibase/bbui"
  import analytics from "analytics"

  const CONTAINER = "@budibase/standard-components/container"

  let name = ""

  async function save() {
    try {
      await store.actions.layouts.save({ name })
      $goto(`./${$store.currentAssetId}`)
      notifier.success(`Layout ${name} created successfully`)
    } catch (err) {
      notifier.danger(`Error creating layout ${name}.`)
    }
  }
</script>

<ModalContent title="Create Layout" confirmText="Create" onConfirm={save}>
  <Input thin label="Name" bind:value={name} />
</ModalContent>
