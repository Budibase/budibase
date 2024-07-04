<script>
import { goto } from "@roxi/routify"
import { screenStore } from "stores/builder"
import NewScreen from "./_components/NewScreen/index.svelte"

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
