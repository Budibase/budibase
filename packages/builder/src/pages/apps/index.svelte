<script lang="ts">
  import { gradient } from "@/actions"
  import {
    auth,
    clientAppsStore,
    licensing,
    organisation,
    translations,
  } from "@/stores/portal"
  import type { EnrichedWorkspace } from "@/types"
  import type { PublishedWorkspaceData, User } from "@budibase/types"
  import {
    Body,
    Divider,
    Heading,
    Icon,
    Layout,
    notifications,
  } from "@budibase/bbui"
  import { helpers, resolveTranslationGroup } from "@budibase/shared-core"
  import { processStringSync } from "@budibase/string-templates"
  import Spaceman from "assets/bb-space-man.svg"
  import { onMount } from "svelte"

  let loaded: boolean = false

  $: userApps = $clientAppsStore.apps

  function getUrl(workspace: EnrichedWorkspace | PublishedWorkspaceData) {
    if (workspace.url) {
      return `/app${workspace.url}`
    } else {
      return `/${workspace.prodId}`
    }
  }

  onMount(async () => {
    try {
      await Promise.all([clientAppsStore.load(), translations.init()])
    } catch (error) {
      notifications.error("Error loading apps")
    }

    loaded = true
  })

  $: translationOverrides = (() => {
    if (!$translations.loaded) {
      return {}
    }
    const locale = $translations.config.defaultLocale
    return $translations.config.locales[locale]?.overrides ?? {}
  })()

  $: portalLabels = resolveTranslationGroup("portal", translationOverrides)

  $: currentUser = $auth.user as User | undefined
  $: greetingText = processStringSync(portalLabels.greeting, {
    name: currentUser ? helpers.getUserLabel(currentUser) : "",
  })

  $: introText = processStringSync(portalLabels.intro, {
    company: $organisation.company || "Budibase",
  })
</script>

{#if loaded}
  <Layout noPadding>
    <Layout noPadding gap="XS">
      <Heading size="M">{greetingText}</Heading>
      <Body>{introText}</Body>
    </Layout>
    <Divider />
    {#if $licensing.errUserLimit}
      <div>
        <Layout gap="S" justifyItems="center">
          <img class="spaceman" alt="spaceman" src={Spaceman} />
          <Heading size="M">{portalLabels.offlineHeading}</Heading>
          {portalLabels.offlineDescription}
        </Layout>
      </div>
    {:else}
      {#if userApps.length}
        <Heading>{portalLabels.appsHeading}</Heading>
        <div class="group">
          <Layout gap="S" noPadding>
            {#each userApps as app (app.appId)}
              <a
                class="app"
                target="_blank"
                rel="noreferrer"
                href={getUrl(app)}
              >
                <div class="preview" use:gradient={{ seed: app.name }}></div>
                <div class="app-info">
                  <Heading size="XS">{app.name}</Heading>
                  <Body size="S">
                    {#if app.updatedAt}
                      {processStringSync(portalLabels.updatedAgo, {
                        time:
                          new Date().getTime() -
                          new Date(app.updatedAt).getTime(),
                      })}
                    {:else}
                      {portalLabels.neverUpdated}
                    {/if}
                  </Body>
                </div>
                <Icon name="caret-right" />
              </a>
            {/each}
          </Layout>
        </div>
      {/if}
      {#if !userApps.length}
        <Layout gap="XS" noPadding>
          <Heading size="S">{portalLabels.noAppsHeading}</Heading>
          <Body size="S">{portalLabels.noAppsDescription}</Body>
        </Layout>
      {/if}
    {/if}
  </Layout>
{/if}

<style>
  img.spaceman {
    width: 100px;
  }
  .app {
    display: grid;
    grid-template-columns: auto 1fr auto;
    background-color: var(--background);
    padding: var(--spacing-xl);
    border-radius: var(--border-radius-s);
    align-items: center;
    grid-gap: var(--spacing-xl);
    color: inherit;
  }
  .app:hover {
    cursor: pointer;
    background: var(--spectrum-global-color-gray-200);
    transition: background-color 130ms ease-in-out;
  }
  .preview {
    height: 40px;
    width: 60px;
    border-radius: var(--border-radius-s);
  }
</style>
