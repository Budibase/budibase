<script lang="ts">
  import { buildLiveUrl } from "@/helpers/urls"
  import { appStore, screenStore, workspaceAppStore } from "@/stores/builder"
  import * as screenTemplating from "@/templates/screenTemplating"
  import {
    Body,
    Icon,
    Input,
    keepOpen,
    Modal,
    ModalContent,
    notifications,
  } from "@budibase/bbui"
  import {
    PublishResourceState,
    type UIWorkspaceApp,
    type WorkspaceApp,
  } from "@budibase/types"
  import { goto } from "@roxi/routify"
  import type { ZodType } from "zod"
  import { z } from "zod"

  export let workspaceApp: UIWorkspaceApp | null = null

  let modal: Modal
  export const show = () => modal.show()

  let data: WorkspaceApp

  $: isNew = !workspaceApp

  $: title = isNew ? "Create new app" : "Edit app"

  const requiredString = (errorMessage: string) =>
    z.string({ required_error: errorMessage }).trim().min(1, errorMessage)

  let validationState: {
    errors: Partial<Record<keyof WorkspaceApp, string>>
    touched: Partial<Record<keyof WorkspaceApp, boolean>>
  }

  const validateWorkspaceApp = (workspaceApp: Partial<WorkspaceApp>) => {
    const validator = z.object({
      name: requiredString("Name is required.").refine(
        val =>
          !$workspaceAppStore.workspaceApps
            .filter(a => a._id !== workspaceApp._id)
            .map(a => a.name.toLowerCase())
            .includes(val.toLowerCase()),
        {
          message: "This name is already taken.",
        }
      ),
      url: requiredString("Url prefix is required.")
        .regex(/^\/[\w-]*$/, {
          message:
            "Url prefix must start with a slash and can only contain alphanumeric characters, hyphens, and underscores.",
        })
        .refine(
          val =>
            !$workspaceAppStore.workspaceApps
              .filter(a => a._id !== workspaceApp._id)
              .map(a => a.url.toLowerCase())
              .includes(val.toLowerCase()),
          {
            message: "This url is already taken.",
          }
        ),
    }) satisfies ZodType<Omit<WorkspaceApp, "navigation" | "isDefault">>

    const validationResult = validator.safeParse(workspaceApp)
    validationState.errors = {}
    if (!validationResult.success) {
      validationState.errors = Object.entries(
        validationResult.error.formErrors.fieldErrors
      ).reduce<Record<string, string>>((acc, [field, errors]) => {
        if (errors[0]) {
          acc[field] = errors[0]
        }
        return acc
      }, {})
    }

    return validationResult
  }

  function onShow() {
    data = {
      _id: workspaceApp?._id,
      _rev: workspaceApp?._rev,
      name: workspaceApp?.name ?? "",
      url: workspaceApp?.url ?? "",
      navigation: workspaceApp?.navigation ?? { navigation: "Top" },
      isDefault: workspaceApp?.isDefault ?? false,
    }
    validationState = { errors: {}, touched: {} }
  }

  async function onConfirm() {
    const validationResult = validateWorkspaceApp({
      ...data,
    })
    if (validationResult.error) {
      return keepOpen
    }

    const { data: workspaceAppData } = validationResult

    try {
      if (isNew) {
        const workspaceApp = await workspaceAppStore.add({
          ...workspaceAppData,
          disabled: true,
        })

        const newScreen = await screenStore.save({
          ...screenTemplating.blank({
            route: "/",
            screens: [],
            workspaceAppId: workspaceApp._id,
          })[0].data,
          workspaceAppId: workspaceApp._id,
        })
        notifications.success("App created successfully")
        $goto(`./${newScreen._id}`)
      } else {
        await workspaceAppStore.edit({
          ...workspaceAppData,
          navigation: workspaceApp!.navigation,
          isDefault: workspaceApp!.isDefault,
          _id: workspaceApp!._id!,
          _rev: workspaceApp!._rev!,
        })
        notifications.success("App updated successfully")
      }
    } catch (e: any) {
      console.error("Error saving app", e)
      notifications.error(`Error saving app: ${e.message}`)
    }
  }

  async function onEnterKey() {
    const result = await onConfirm()
    if (result === keepOpen) {
      return result
    }

    modal.hide()
  }

  $: {
    if (data && !data.url.startsWith("/")) {
      data.url = `/${data.url}`
    }
  }

  $: if (isNew && data?.name && !validationState.touched.url) {
    data.url = `/${data.name
      .toLowerCase()
      .trim()
      .replace(/[^a-zA-Z0-9- ]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")}`
  }

  $: editingPublishedApp =
    workspaceApp?.publishStatus.state === PublishResourceState.PUBLISHED
</script>

<Modal bind:this={modal} on:show={onShow} on:hide>
  <ModalContent {title} {onConfirm} size="M" disabled={editingPublishedApp}>
    <Input
      label="App Name"
      on:enterkey={onEnterKey}
      on:input={() => {
        validationState.touched.name = true
        delete validationState.errors.name
      }}
      bind:value={data.name}
      error={validationState.errors.name}
      disabled={editingPublishedApp}
    />

    <Input
      label="Url"
      on:enterkey={onEnterKey}
      on:input={() => {
        validationState.touched.url = true
        delete validationState.errors.url
      }}
      bind:value={data.url}
      error={validationState.errors.url}
      disabled={editingPublishedApp}
    />
    <div class="live-url-display">
      {buildLiveUrl($appStore, data.url, false)}
    </div>

    {#if editingPublishedApp}
      <div class="edit-info">
        <Icon size="M" name="info" />
        <Body size="S">Unpublish your app to edit its name and URL</Body>
      </div>
    {/if}
  </ModalContent>
</Modal>

<style>
  .live-url-display {
    margin-top: calc(var(--spacing-l) * -1);
    color: var(--spectrum-global-color-gray-600);
    padding-top: 0;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .edit-info {
    display: flex;
    gap: var(--spacing-m);
  }
</style>
