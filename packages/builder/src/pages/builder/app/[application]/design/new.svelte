<script lang="ts">
  import NewScreen from "./_components/NewScreen/index.svelte"
  import { screenStore } from "@/stores/builder"
  import { goto } from "@roxi/routify"
  import { onMount } from "svelte"

  let newScreenModal: NewScreen

  $: onClose = getOnClose($screenStore)

  const getOnClose = ({ screens, selectedScreenId }: typeof $screenStore) => {
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

  onMount(() => {
    newScreenModal.show()
  })
</script>

<NewScreen {onClose} bind:this={newScreenModal} inline />
