<script lang="ts">
  import {
    Body,
    Button,
    CopyInput,
    Input,
    Label,
    notifications,
  } from "@budibase/bbui"
  import { ChatCommands } from "@budibase/shared-core"
  import type { Agent } from "@budibase/types"
  import { agentsStore } from "@/stores/portal"
  import { deploymentStore } from "@/stores/builder"
  import ChannelConfigLayout from "./ChannelConfigLayout.svelte"
  import {
    DEFAULT_IDLE_TIMEOUT_MINUTES,
    toOptionalIdleTimeout,
    toOptionalValue,
  } from "./utils"

  const MS_TEAMS_NEW_COMMAND = ChatCommands.NEW
  const MS_TEAMS_LINK_COMMAND = ChatCommands.LINK
  let { agent }: { agent?: Agent } = $props()

  let draftAgentId: string | undefined = $state()
  let draft = $state({
    appId: "",
    appPassword: "",
    tenantId: "",
    idleTimeoutMinutes: DEFAULT_IDLE_TIMEOUT_MINUTES,
    iconName: "",
    iconPreview: "",
    colorIcon: "",
    outlineIcon: "",
  })

  let provisioning = $state(false)
  let iconInput: HTMLInputElement | undefined = $state()

  const messagingEndpointUrl = $derived(
    agent?.MSTeamsIntegration?.messagingEndpointUrl || ""
  )

  const hasRequiredCredentials = $derived.by(
    () =>
      !!(
        draft.appId.trim() &&
        draft.appPassword.trim() &&
        draft.tenantId.trim()
      )
  )

  const isProvisioned = $derived.by(
    () => messagingEndpointUrl.trim().length > 0
  )
  const hasAppIcon = $derived.by(
    () => !!(draft.colorIcon.trim() && draft.outlineIcon.trim())
  )
  const canDownloadPackage = $derived.by(
    () => hasRequiredCredentials && hasAppIcon
  )

  $effect(() => {
    const currentAgent = agent
    if (!currentAgent || currentAgent._id === draftAgentId) {
      return
    }

    const integration = currentAgent.MSTeamsIntegration
    draft = {
      appId: integration?.appId || "",
      appPassword: integration?.appPassword || "",
      tenantId: integration?.tenantId || "",
      idleTimeoutMinutes:
        integration?.idleTimeoutMinutes || DEFAULT_IDLE_TIMEOUT_MINUTES,
      iconName: "",
      iconPreview: "",
      colorIcon: "",
      outlineIcon: "",
    }
    draftAgentId = currentAgent._id
  })

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result || ""))
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })

  const loadImage = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = reject
      image.src = src
    })

  const createTeamsIcon = (
    image: HTMLImageElement,
    size: number,
    monochrome = false
  ) => {
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      return ""
    }

    if (!monochrome) {
      ctx.fillStyle = "#1e1e2f"
      ctx.fillRect(0, 0, size, size)
    }

    const scale = Math.min(
      size / image.naturalWidth,
      size / image.naturalHeight
    )
    const width = image.naturalWidth * scale
    const height = image.naturalHeight * scale
    ctx.drawImage(image, (size - width) / 2, (size - height) / 2, width, height)

    if (monochrome) {
      const pixels = ctx.getImageData(0, 0, size, size)
      for (let i = 0; i < pixels.data.length; i += 4) {
        if (pixels.data[i + 3] > 16) {
          pixels.data[i] = 255
          pixels.data[i + 1] = 255
          pixels.data[i + 2] = 255
        }
      }
      ctx.putImageData(pixels, 0, 0)
    }

    return canvas.toDataURL("image/png")
  }

  const chooseIcon = () => {
    iconInput?.click()
  }

  const clearIcon = () => {
    draft = {
      ...draft,
      iconName: "",
      iconPreview: "",
      colorIcon: "",
      outlineIcon: "",
    }
    if (iconInput) {
      iconInput.value = ""
    }
  }

  const handleIconUpload = async (event: Event) => {
    const input = event.currentTarget as HTMLInputElement
    const file = input.files?.[0]
    if (!file) {
      return
    }
    if (!file.type.startsWith("image/")) {
      notifications.error("Choose an image file for the Teams app icon")
      return
    }

    try {
      const preview = await readFileAsDataUrl(file)
      const image = await loadImage(preview)
      draft = {
        ...draft,
        iconName: file.name,
        iconPreview: preview,
        colorIcon: createTeamsIcon(image, 192),
        outlineIcon: createTeamsIcon(image, 32, true),
      }
    } catch (error) {
      console.error(error)
      notifications.error("Failed to prepare the Teams app icon")
    }
  }

  const downloadPackage = (blob: Blob) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${agent?.name || "budibase-agent"}-teams-app.zip`
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 0)
  }

  const saveAndDownloadMSTeamsPackage = async () => {
    if (!agent?._id || provisioning || !canDownloadPackage) {
      return
    }

    provisioning = true
    try {
      await agentsStore.updateAgent({
        ...agent,
        MSTeamsIntegration: {
          appId: toOptionalValue(draft.appId),
          appPassword: toOptionalValue(draft.appPassword),
          tenantId: toOptionalValue(draft.tenantId),
          chatAppId: agent.MSTeamsIntegration?.chatAppId,
          messagingEndpointUrl: agent.MSTeamsIntegration?.messagingEndpointUrl,
          idleTimeoutMinutes: toOptionalIdleTimeout(draft.idleTimeoutMinutes),
        },
      })
      const appPackage = await agentsStore.downloadMSTeamsAppPackage(
        agent._id,
        {
          colorIcon: draft.colorIcon,
          outlineIcon: draft.outlineIcon,
        }
      )
      downloadPackage(appPackage)
      if (agent.live) {
        await deploymentStore.publishApp()
      }
      notifications.success("Microsoft Teams app package downloaded")
    } catch (error) {
      console.error(error)
      notifications.error("Failed to download Microsoft Teams app package")
    } finally {
      provisioning = false
    }
  }
</script>

<ChannelConfigLayout
  statusPositive={isProvisioned}
  positiveStatusLabel="Configured"
  negativeStatusLabel="Not configured"
  actionLabel={provisioning
    ? "Downloading..."
    : isProvisioned
      ? "Download app package"
      : "Save and download package"}
  actionDisabled={provisioning || !canDownloadPackage}
  onAction={saveAndDownloadMSTeamsPackage}
>
  {#snippet fields()}
    <Input label="App ID (client ID)" bind:value={draft.appId} />
    <Input
      label="Client secret (value)"
      type="password"
      bind:value={draft.appPassword}
    />
    <Input label="Directory (tenant) ID" bind:value={draft.tenantId} />
    <Input
      label="Idle timeout (minutes)"
      type="number"
      bind:value={draft.idleTimeoutMinutes}
    />

    <div class="icon-row">
      <Label>App icon</Label>
      <div class="icon-control">
        <div class="icon-thumb">
          {#if draft.iconPreview}
            <img src={draft.iconPreview} alt="" />
          {:else}
            <span>{agent?.name?.trim()?.[0]?.toUpperCase() || "B"}</span>
          {/if}
        </div>
        <div class="icon-meta">
          <Body size="S">
            {draft.iconName || "Choose an icon to continue"}
          </Body>
          <Body size="XS">Required for the installable Teams app package</Body>
        </div>
        <div class="icon-buttons">
          {#if draft.iconPreview}
            <Button secondary quiet on:click={clearIcon}>Reset</Button>
          {/if}
          <Button secondary icon="image" on:click={chooseIcon}>
            Choose icon
          </Button>
        </div>
      </div>
      <input
        bind:this={iconInput}
        type="file"
        accept="image/*"
        onchange={handleIconUpload}
      />
    </div>
  {/snippet}

  {#snippet response()}
    <Body size="S">Send a normal message to ask a question.</Body>
    <Body size="S">
      Use `{MS_TEAMS_NEW_COMMAND}` to start a new conversation.
    </Body>
    <Body size="S">
      Use `{MS_TEAMS_LINK_COMMAND}` or `/{MS_TEAMS_LINK_COMMAND}` to link or
      refresh your Budibase account.
    </Body>

    <CopyInput
      label="Messaging endpoint URL"
      value={messagingEndpointUrl}
      disabled
    />
  {/snippet}
</ChannelConfigLayout>

<style>
  .icon-row {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .icon-control {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }

  .icon-thumb {
    flex: 0 0 auto;
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    border-radius: 4px;
    background: var(--spectrum-global-color-gray-200);
    color: var(--spectrum-global-color-gray-700);
    font-size: 16px;
    font-weight: 600;
    overflow: hidden;
  }

  .icon-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .icon-meta {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .icon-buttons {
    flex: 0 0 auto;
    display: flex;
    gap: var(--spacing-xs);
    align-items: center;
  }

  .icon-row input[type="file"] {
    display: none;
  }

  @media (max-width: 900px) {
    .icon-control {
      flex-wrap: wrap;
    }

    .icon-buttons {
      margin-left: auto;
    }
  }
</style>
