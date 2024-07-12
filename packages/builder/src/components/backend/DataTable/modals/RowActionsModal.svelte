<script>
  import { ModalContent, notifications } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { API } from "api"

  let basePermissions = []

  const fetchBasePermissions = async () => {
    try {
      basePermissions = await API.getBasePermissions()
    } catch (error) {
      notifications.error("Error fetching base permission options")
      basePermissions = []
    }
  }

  onMount(fetchBasePermissions)
</script>

<ModalContent
  title="Row actions"
  showConfirmButton={false}
  showCancelButton={false}>TODO</ModalContent
>
