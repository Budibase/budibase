<script>
  import NewScreen from "./_components/NewScreen/index.svelte"
  import { store } from "builderStore"
  import { goto } from "@roxi/routify"

  $: onClose = getOnClose($store)

  const getOnClose = ({ screens, selectedScreenId }) => {
    if (!screens?.length) {
      return null
    }
    if (selectedScreenId) {
      return () => {
        $goto(`./${selectedScreenId}`)
      }
    }
    return () => {
      $goto(`./${screens[0]._id}`)
    }
  }
</script>

<NewScreen {onClose} />
