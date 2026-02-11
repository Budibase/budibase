<script>
  import TopBar from "@/components/common/TopBar.svelte"
  import RoleEditor from "@/components/backend/RoleEditor/RoleEditor.svelte"
  import { builderStore } from "@/stores/builder"

  builderStore.selectResource("roles")
</script>

<div class="wrapper">
  <TopBar icon="lock-simple-open" breadcrumbs={[{ text: "Manage roles" }]}></TopBar>
  <div class="content">
    <RoleEditor />
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex: 1 1 auto;
    min-height: 0;
  }
  .content {
    padding: 28px 40px 40px 40px;
    overflow-y: auto;
    gap: var(--spacing-l);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    flex: 1 1 auto;
    z-index: 2;
    position: relative;
    min-height: 0;
  }
</style>
