<script>
  import RoleEditor from "@/components/backend/RoleEditor/RoleEditor.svelte"
  import { builderStore } from "@/stores/builder"

  builderStore.selectResource("roles")
</script>

<RoleEditor />
