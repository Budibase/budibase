<script lang="ts">
  import { Modal, notifications } from "@budibase/bbui"
  import { beforeUrlChange } from "@roxi/routify"
  import { restTemplates } from "@/stores/builder/restTemplates"
  import { sortedIntegrations as integrations } from "@/stores/builder/sortedIntegrations"
  import { queries } from "@/stores/builder"
  import { configFromIntegration } from "@/stores/selectors"
  import { datasources } from "@/stores/builder/datasources"
  import { IntegrationTypes } from "@/constants/backend"
  import {
    type RestTemplateSpec,
    type RestTemplate,
    type TemplateSelectionContext,
    type UIIntegration,
  } from "@budibase/types"
  import { goto as gotoStore } from "@roxi/routify"
  import { getRestTemplateImportInfoRequest } from "@/helpers/restTemplates"
  import SelectCategoryAPIModal from "./SelectCategoryAPIModal.svelte"

  export const show = () => modal.show()
  export const hide = () => modal.hide()

  let modal: Modal
  let loading = false

  let selectedTemplate: TemplateSelectionContext | null = null
  let targetSpec: RestTemplateSpec | null = null

  $beforeUrlChange(() => {
    return true
  })

  $: goto = $gotoStore

  $: templatesValue = $restTemplates?.templates || []
  $: restIntegration = ($integrations || []).find(
    integration => integration.name === IntegrationTypes.REST
  )

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
        goto(`./query/new/${ds._id}`)
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
    const request = getRestTemplateImportInfoRequest(spec)
    if (!request) {
      return undefined
    }
    return await queries.fetchImportInfo(request)
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

  const handleTemplateSelection = async (
    template: TemplateSelectionContext
  ) => {
    if (loading) return

    if (!restIntegration) {
      notifications.error("REST API integration is unavailable.")
      return
    }

    try {
      loading = true
      selectedTemplate = template

      targetSpec = template.specs?.[0] || null

      const config = configFromIntegration(restIntegration)
      const templateInfo = await loadTemplateInfo(targetSpec)
      applySecurityHeaders(config, templateInfo?.securityHeaders)
      applyTemplateStaticVariables(config, templateInfo?.staticVariables)

      const ds = await datasources.create({
        integration: restIntegration,
        config,
        name: buildDatasourceName(selectedTemplate, targetSpec),
        ...(template.restTemplateId
          ? {
              restTemplateId: template.restTemplateId,
              ...(targetSpec?.version
                ? { restTemplateVersion: targetSpec.version }
                : {}),
            }
          : {}),
      })

      await datasources.fetch()
      goto(`./datasource/${ds._id}`)

      notifications.success(`${selectedTemplate.name} API created`)
      modal.hide()
    } catch (error: any) {
      notifications.error(
        `Error importing template - ${error?.message || "Unknown error"}`
      )
    } finally {
      loading = false
      selectedTemplate = null
      targetSpec = null
    }
  }

  const buildDatasourceName = (
    template: TemplateSelectionContext,
    spec?: RestTemplateSpec | null
  ) => {
    if (spec && (template.specs?.length ?? 0) > 1 && spec.version) {
      return `${template.name} (${spec.version})`
    }
    return template.name
  }

  const onSelectTemplate = (event: CustomEvent<RestTemplate>) => {
    const template = event.detail
    handleTemplateSelection({
      name: template.name,
      description: template.description,
      specs: template.specs ?? [],
      icon: template.icon,
      restTemplateId: template.id,
    })
  }
</script>

<div class="settings-wrap">
  <Modal bind:this={modal} autoFocus={false}>
    <div
      class="spectrum-Dialog--large"
      role="dialog"
      tabindex="-1"
      aria-modal="true"
    >
      <SelectCategoryAPIModal
        templates={templatesValue}
        {loading}
        customDisabled={!restIntegration}
        on:custom={() => handleCustom(restIntegration)}
        on:selectTemplate={onSelectTemplate}
      />
    </div>
  </Modal>
</div>

<style>
  .spectrum-Dialog--large {
    width: 920px;
    max-width: 94vw;
    min-height: 360px;
    max-height: 540px;
    height: auto;
  }
</style>
