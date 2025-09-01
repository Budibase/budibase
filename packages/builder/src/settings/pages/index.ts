import { SvelteComponent } from "svelte"

type LazyComponentLoader = () => Promise<{
  default: typeof SvelteComponent<any>
}>

export const lazy = async (
  id: string
): Promise<typeof SvelteComponent<any> | undefined> => {
  const loader = componentMap[id]
  if (!loader) {
    console.error("Invalid component id:", id)
    return
  }

  const mod = await loader()
  return mod.default
}

// General
const componentMap: Record<string, LazyComponentLoader> = {
  profile: () => import("@/settings/pages/profile.svelte"),
  users: () => import("@/settings/pages/people/users/index.svelte"),
  user: () => import("@/settings/pages/people/users/user.svelte"),
  user_invites: () => import("@/settings/pages/people/users/invites.svelte"),
  group: () => import("@/settings/pages/people/groups/group.svelte"),
  groups: () => import("@/settings/pages/people/groups/index.svelte"),
  plugins: () => import("@/settings/pages/plugins/index.svelte"),
  email: () => import("@/settings/pages/email.svelte"),
  email_templates: () => import("@/settings/pages/email/EmailTemplates.svelte"),
  email_template: () => import("@/settings/pages/email/Template.svelte"),
  audit_logs: () => import("@/settings/pages/auditLogs/index.svelte"),
  ai: () => import("@/settings/pages/ai/index.svelte"),
  auth: () => import("@/settings/pages/auth/index.svelte"),
  org: () => import("@/settings/pages/organisation.svelte"),
  branding: () => import("@/settings/pages/branding.svelte"),
  environment: () => import("@/settings/pages/environment/index.svelte"),
  version: () => import("@/settings/pages/version.svelte"),
  diagnostics: () => import("@/settings/pages/diagnostics.svelte"),
  system_logs: () => import("@/settings/pages/systemLogs.svelte"),
  upgrade: () => import("@/settings/pages/upgrade.svelte"),
  usage: () => import("@/settings/pages/usage.svelte"),

  // App
  general_info: () => import("@/settings/pages/general.svelte"),
  automations: () => import("@/settings/pages/automations/automations.svelte"),
  backups: () => import("@/settings/pages/backups/index.svelte"),
  pwa: () => import("@/settings/pages/pwa.svelte"),
  embed: () => import("@/settings/pages/embed.svelte"),
  scripts: () => import("@/settings/pages/scripts.svelte"),
  oauth2: () => import("@/settings/pages/oauth2/index.svelte"),
}

export const routeActions = (
  node: HTMLElement,
  target = ".route-header .page-actions"
) => {
  let targetEl = document.querySelector(target)

  if (targetEl) {
    targetEl.appendChild(node)
  }

  return {
    destroy() {
      if (node.parentNode) {
        node.parentNode.removeChild(node)
      }
    },
  }
}
