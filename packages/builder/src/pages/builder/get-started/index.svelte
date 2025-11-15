<script lang="ts">
  import ExampleApp from "./_components/ExampleApp.svelte"
  import { Body, Button, Heading, Layout, Modal } from "@budibase/bbui"
  import { SplitPage } from "@budibase/frontend-core"
  import { goto } from "@roxi/routify"
  import { appsStore } from "@/stores/portal/apps"
  import { auth } from "@/stores/portal/auth"
  import BBLogo from "assets/BBLogo.svelte"
  import CreateWorkspaceModal from "../workspace/[application]/_components/CreateWorkspaceModal.svelte"
  import type { CreateWorkspaceResponse } from "@budibase/types"
  import { sdk } from "@budibase/shared-core"

  let createWorkspaceModal: Modal
  let loading = false

  const initialise = async (event: CustomEvent<CreateWorkspaceResponse>) => {
    // Refresh auth if user is not yet a builder for the created app
    if (!sdk.users.isBuilder($auth.user, event.detail?.appId)) {
      await auth.getSelf()
    }
    // Refresh the apps list to include the newly created app
    await appsStore.load()
    // Redirect to the newly created workspace
    $goto(`/builder/workspace/${event.detail.instance._id}`)
  }
</script>

<Modal
  bind:this={createWorkspaceModal}
  on:show={() => (loading = true)}
  on:hide={() => (loading = false)}
>
  <CreateWorkspaceModal redirectOnCreate={false} on:created={initialise} />
</Modal>

<div class="full-width">
  <SplitPage>
    <div>
      <Layout justifyItems="center">
        <div class="budibaseLogo">
          <BBLogo size={36} color={"var(--spectrum-global-color-gray-900)"} />
        </div>
        <Heading>Create your own workspace</Heading>
        <Body textAlign="center">
          You don't currently have access to any workspaces, so let's get you
          set up with one of your own!
        </Body>
        <div class="options">
          <Button
            size="L"
            cta
            disabled={loading}
            on:click={() => {
              createWorkspaceModal.show()
            }}
          >
            Lets go!
          </Button>
          <Button
            size="L"
            secondary
            cta
            disabled={loading}
            on:click={() => {
              $goto("../apps")
            }}
          >
            View app portal
          </Button>
        </div>
      </Layout>
    </div>
    <div slot="right">
      <ExampleApp />
    </div>
  </SplitPage>
</div>

<style>
  .options {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-m);
  }
  .full-width {
    width: 100%;
  }
  .budibaseLogo {
    width: 42px;
  }
  .full-width :global(.split-page .left .content) {
    align-content: center;
  }
</style>
