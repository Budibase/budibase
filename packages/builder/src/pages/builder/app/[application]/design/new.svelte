<script>
  import NewScreen from "./_components/NewScreen/index.svelte"
  import { screenStore } from "@/stores/builder"
  import { goto } from "@roxi/routify"

  $: onClose = getOnClose($screenStore)

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
