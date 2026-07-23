<script lang="ts">
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import TopBar from "@/components/common/TopBar.svelte"
  import { getErrorMessage } from "@/helpers/errors"
  import { appStore, builderStore, functionStore } from "@/stores/builder"
  import type { UIFunction } from "@/stores/builder/functions"
  import { auth, featureFlags } from "@/stores/portal"
  import { Modal, ModalContent, notifications } from "@budibase/bbui"
  import { FeatureFlag } from "@budibase/types"
  import { onMount } from "svelte"
  import FunctionList from "./FunctionList.svelte"
  import FunctionNameModal from "./FunctionNameModal.svelte"
  import { canManageFunctions } from "./permissions"

  const DEFAULT_SOURCE = `import type { FunctionResult } from "@budibase/functions"

export default async function (): Promise<FunctionResult> {
  return { output: {} }
}`

  let nameModal: FunctionNameModal
  let deleteDialog: ConfirmDialog
  let blockedDialog: Modal
  let selectedFunction: UIFunction | undefined
  let blockedDeleteMessage = ""

  $: enabled = $featureFlags[FeatureFlag.FUNCTIONS]
  $: canManage = enabled && canManageFunctions($auth.user, $appStore.appId)
  $: functions = functionStore.getList($functionStore)
  $: if (enabled) {
    builderStore.selectResource("functions")
  }

  const createFunction = () => {
    nameModal.show({
      title: "New Function",
      confirmText: "Create",
      onConfirm: async name => {
        await functionStore.create({
          name,
          source: DEFAULT_SOURCE,
          capabilities: [],
        })
        notifications.success("Function created")
      },
    })
  }

  const renameFunction = (fn: UIFunction) => {
    nameModal.show({
      title: "Rename Function",
      confirmText: "Rename",
      name: fn.name,
      onConfirm: async name => {
        await functionStore.rename(fn, name)
        notifications.success("Function renamed")
      },
    })
  }

  const duplicateFunction = async (fn: UIFunction) => {
    try {
      await functionStore.duplicate(fn)
      notifications.success("Function duplicated")
    } catch (error) {
      notifications.error(
        getErrorMessage(error) || "Unable to duplicate Function"
      )
    }
  }

  const requestDelete = (fn: UIFunction) => {
    selectedFunction = fn
    deleteDialog.show()
  }

  const deleteFunction = async () => {
    if (!selectedFunction) {
      return
    }
    try {
      await functionStore.delete(selectedFunction)
      deleteDialog.hide()
      notifications.success("Function deleted")
    } catch (error) {
      deleteDialog.hide()
      blockedDeleteMessage =
        getErrorMessage(error) || "Unable to delete Function"
      blockedDialog.show()
    }
  }

  onMount(() => {
    if (enabled && canManage) {
      functionStore.fetch()
    }
  })
</script>

<FunctionNameModal bind:this={nameModal} />

<ConfirmDialog
  bind:this={deleteDialog}
  title="Delete Function"
  body={`Are you sure you want to delete ${selectedFunction?.name || "this Function"}?`}
  okText="Delete"
  onOk={deleteFunction}
/>

<Modal bind:this={blockedDialog}>
  <ModalContent
    title="Function cannot be deleted"
    showConfirmButton={false}
    showCancelButton
    cancelText="Close"
  >
    {blockedDeleteMessage}
  </ModalContent>
</Modal>

<div class="wrapper">
  <TopBar
    breadcrumbs={[{ text: "Automations", url: "../" }, { text: "Functions" }]}
    icon="code"
  />
  <FunctionList
    {functions}
    loading={$functionStore.loading}
    error={$functionStore.error}
    {canManage}
    onRetry={() => functionStore.fetch()}
    onCreate={createFunction}
    onRename={renameFunction}
    onDuplicate={duplicateFunction}
    onDelete={requestDelete}
  />
</div>

<style>
  .wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
