<script lang="ts">
  import { Modal, Button, Divider, notifications } from "@budibase/bbui"
  import { beforeUrlChange } from "@roxi/routify"
  import { restTemplates } from "@/stores/builder/restTemplates"
  import { sortedIntegrations as integrations } from "@/stores/builder/sortedIntegrations"
  import { queries } from "@/stores/builder"
  import { configFromIntegration } from "@/stores/selectors" //??
  import { datasources } from "@/stores/builder/datasources"
  import { IntegrationTypes } from "@/constants/backend"
  import {
    type RestTemplateSpec,
    type RestTemplate,
    type UIIntegration,
  } from "@budibase/types"
  import { goto } from "@roxi/routify"

  export const show = () => modal.show()
  export const hide = () => modal.hide()

  let modal: Modal
  let scrolling = false
  let page: HTMLDivElement
  let loading = false

  let selectedTemplate: RestTemplate | null = null
  let targetSpec: RestTemplateSpec | null = null

  $beforeUrlChange(() => {
    return true
  })

  $: templates = $restTemplates?.templates
  $: restIntegration = ($integrations || []).find(
    integration => integration.name === IntegrationTypes.REST
  )

  const handleScroll = (e: Event) => {
    const target = e.target as HTMLDivElement
    scrolling = target?.scrollTop !== 0
  }

  // CUSTOM REST
  const handleCustom = async (integration?: UIIntegration) => {
    if (!integration || loading) return
    try {
      if (integration.name === IntegrationTypes.REST) {
        loading = true
        const ds = await datasources.create({
          integration,
          config: configFromIntegration(integration),
        })
        await datasources.fetch()

        // Go to the new query page.
        $goto(`./query/new/${ds._id}`)
      }
    } catch {
      notifications.error("There was a problem creating your new api")
    }

    modal.hide()
    loading = false
    selectedTemplate = null
    targetSpec = null
  }

  const loadTemplateInfo = async (spec?: RestTemplateSpec | null) => {
    if (!spec?.url) {
      return undefined
    }
    try {
      return await queries.fetchImportInfo({ url: spec.url })
    } catch (err) {
      console.warn("Failed to load template metadata", err)
      return undefined
    }
  }

  const applySecurityHeaders = (
    config: Record<string, any>,
    securityHeaders?: string[] | null
  ) => {
    const normalizedHeaders = (securityHeaders || []).filter(
      (header): header is string => Boolean(header)
    )
    if (!normalizedHeaders.length) {
      return config
    }
    const headers = (config.defaultHeaders = config.defaultHeaders || {})
    for (const header of normalizedHeaders) {
      if (!header) {
        continue
      }
      const normalized = header.toLowerCase()
      const existing = Object.keys(headers).find(
        key => key?.toLowerCase() === normalized
      )
      if (!existing) {
        headers[header] = headers[header] ?? ""
      }
    }
    return config
  }

  const applyTemplateStaticVariables = (
    config: Record<string, any>,
    staticVariables?: Record<string, string> | null
  ) => {
    if (!staticVariables) {
      return config
    }
    const entries = Object.entries(staticVariables).filter(
      ([name]) => name.trim() !== ""
    )
    if (!entries.length) {
      return config
    }
    const templateVariables = new Set(
      (config.templateStaticVariables || []).filter(Boolean)
    )
    config.staticVariables ||= {}
    for (const [name, value] of entries) {
      templateVariables.add(name)
      if (config.staticVariables[name] == null) {
        config.staticVariables[name] = value ?? ""
      }
    }
    config.templateStaticVariables = Array.from(templateVariables)
    return config
  }

  const handleTemplateSelection = async (template: RestTemplate) => {
    if (loading) return

    if (!restIntegration) {
      notifications.error("REST API integration is unavailable.")
      return
    }

    try {
      loading = true
      selectedTemplate = template

      // Initially we only support 1 type
      targetSpec = template.specs[0] || null

      const config = configFromIntegration(restIntegration)
      const templateInfo = await loadTemplateInfo(targetSpec)
      applySecurityHeaders(config, templateInfo?.securityHeaders)
      applyTemplateStaticVariables(config, templateInfo?.staticVariables)

      const ds = await datasources.create({
        integration: restIntegration,
        config,
        name: buildDatasourceName(selectedTemplate, targetSpec),
        restTemplate: selectedTemplate.name,
        restTemplateVersion: targetSpec.version,
      })

      await datasources.fetch()

      // Go to the newly created datasource page.
      $goto(`./datasource/${ds._id}`)

      notifications.success(`${selectedTemplate.name} API created`)
    } catch (error: any) {
      notifications.error(
        `Error importing template - ${error?.message || "Unknown error"}`
      )
    }
    modal.hide()
    loading = false
    selectedTemplate = null
    targetSpec = null
  }

  const buildDatasourceName = (
    template: RestTemplate,
    spec: RestTemplateSpec
  ) => {
    if (template.specs.length > 1 && spec.version) {
      return `${template.name} (${spec.version})`
    }
    return template.name
  }
</script>

<div class="settings-wrap">
  <Modal bind:this={modal} on:hide>
    <div
      class="api-dialog spectrum-Dialog spectrum-Dialog--large"
      style="position: relative;"
      role="dialog"
      tabindex="-1"
      aria-modal="true"
    >
      <section class="spectrum-Dialog-content">
        <div class="api-main" class:scrolling>
          <div class="api-header">
            <div>API connectors</div>
            <div>
              <Button
                secondary
                icon="plus"
                disabled={loading}
                on:click={() => {
                  handleCustom(restIntegration)
                }}
              >
                Custom REST API
              </Button>
            </div>
          </div>
          <Divider size={"S"} noMargin />
          <div class="contents-wrap" on:scroll={handleScroll}>
            <div class="shadow"></div>
            <div bind:this={page} class="contents">
              <div class="grid">
                {#each templates as template}
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <!-- svelte-ignore a11y-no-static-element-interactions -->
                  <div
                    class="api"
                    class:disabled={loading}
                    on:click={() => {
                      handleTemplateSelection(template)
                    }}
                  >
                    <div class="api-icon">
                      <img src={template.icon} alt={template.name} />
                    </div>

                    {template.name}
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </Modal>
</div>

<style>
  @property --shadow-opacity-1 {
    syntax: "<number>";
    initial-value: 0;
    inherits: false;
  }

  @property --shadow-opacity-2 {
    syntax: "<number>";
    initial-value: 0;
    inherits: false;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
  }

  .api {
    display: flex;
    height: 38px;
    padding: 6px 12px;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      opacity 0.2s ease;
    font-size: 14px;
    border-radius: 8px;
    border: 1px solid var(--spectrum-global-color-gray-200);
    background-color: var(--spectrum-global-color-gray-100);
    position: relative;
  }

  .api:hover {
    background-color: var(--spectrum-global-color-gray-300);
  }

  .api.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .api.disabled img {
    filter: grayscale(100%);
    opacity: 0.6;
  }

  .api img {
    width: 20px;
    height: 20px;
    transition:
      filter 0.2s ease,
      opacity 0.2s ease;
  }
  .api-icon {
    border-radius: 4px;
    border: 1px solid var(--spectrum-global-color-gray-200);
    display: flex;
    width: 36px;
    height: 36px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }
  .api-header {
    padding: var(--spacing-l) var(--spectrum-dialog-confirm-padding);
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--spectrum-global-color-gray-800);
    font-size: 16px;
    font-weight: 600;
  }

  .api-main .contents {
    padding-left: var(--spectrum-dialog-confirm-padding);
    padding-right: var(--spectrum-dialog-confirm-padding);
  }

  .api-main :global(hr) {
    background-color: var(--spectrum-global-color-gray-300);
  }

  /*
    Add a shadow under the scrollbar
  */
  .contents-wrap {
    flex: 1 1 auto;
    overflow-y: auto;

    min-height: 0;
    position: relative;
    background:
      linear-gradient(
        to right,
        transparent calc(100% - 20px),
        transparent calc(100% - 20px)
      ),
      linear-gradient(
        to bottom,
        rgba(0, 0, 0, var(--shadow-opacity-1)) 0px,
        rgba(0, 0, 0, var(--shadow-opacity-2)) 5px,
        transparent 15px
      );
    background-repeat: no-repeat;
    background-position: top right;
    background-size:
      100% 20px,
      15px 20px;
    transition:
      --shadow-opacity-1 0.2s ease,
      --shadow-opacity-2 0.2s ease;
  }

  .api-main.scrolling .contents-wrap {
    --shadow-opacity-1: 0.2;
    --shadow-opacity-2: 0.1;
  }

  .api-main.scrolling .shadow {
    box-shadow: inset 0px 15px 10px -10px rgba(0, 0, 0, 0.2);
  }

  .api-main .shadow {
    transition: box-shadow 0.2s ease;
  }

  .shadow {
    width: 100%;
    height: var(--spacing-l);
    display: inline-block;
    position: sticky;
    top: 0;
    left: 0;
  }

  .contents {
    padding-bottom: 30px;
  }

  .spectrum-Dialog.spectrum-Dialog--large {
    width: 720px;
    min-height: 320px;
    max-height: 540px;
    height: auto;
  }

  .spectrum-Dialog-content {
    margin: 0px;
    padding: 0px;
    border-radius: var(--spectrum-global-dimension-size-100);
    width: 100%;
    display: flex;
    overflow: hidden;
    flex: 1;
    min-height: 0;
  }

  .api-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: var(--background);
    min-height: 0;
  }

  .spectrum-Dialog-content :global(.nav_wrapper .nav) {
    border-top-left-radius: var(--spectrum-global-dimension-size-100);
    border-bottom-left-radius: var(--spectrum-global-dimension-size-100);
  }

  .spectrum-Dialog-content :global(.nav_header) {
    padding-top: var(--spacing-l);
    padding-bottom: var(--spacing-l);
    flex: 0 0 32px;
  }
</style>
