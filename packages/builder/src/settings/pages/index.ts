import { ComponentType } from "svelte"

// General
import ProfilePage from "@/settings/pages/profile.svelte"
import UsersPage from "@/settings/pages/people/users/index.svelte"
import UserPage from "@/settings/pages/people/users/user.svelte"
import UserInvitesPage from "@/settings/pages/people/users/invites.svelte"
import GroupPage from "@/settings/pages/people/groups/group.svelte"
import GroupsPage from "@/settings/pages/people/groups/index.svelte"
import PluginsPage from "@/settings/pages/plugins/index.svelte"
import EmailPage from "@/settings/pages/email.svelte"
import EmailTemplatesPage from "@/settings/pages/email/EmailTemplates.svelte"
import EmailImapPage from "@/settings/pages/email/Imap.svelte"
import EmailTemplatePage from "@/settings/pages/email/Template.svelte"
import AuditLogsPage from "@/settings/pages/auditLogs/index.svelte"
import AIPage from "@/settings/pages/ai/index.svelte"
import AuthPage from "@/settings/pages/auth/index.svelte"
import OrgPage from "@/settings/pages/organisation.svelte"
import BrandingPage from "@/settings/pages/branding.svelte"
import EnvironmentPage from "@/settings/pages/environment/index.svelte"
import VersionPage from "@/settings/pages/version.svelte"
import DiagnosticsPage from "@/settings/pages/diagnostics.svelte"
import SystemLogsPage from "@/settings/pages/systemLogs.svelte"
import UpgradePage from "@/settings/pages/upgrade.svelte"
import UsagePage from "@/settings/pages/usage.svelte"

// App pages
import GeneralInfoPage from "@/settings/pages/general.svelte"
import AutomationsPage from "@/settings/pages/automations/automations.svelte"
import BackupsPage from "@/settings/pages/backups/index.svelte"
import PWAPage from "@/settings/pages/pwa.svelte"
import EmbedPage from "@/settings/pages/embed.svelte"
import ScriptsPage from "@/settings/pages/scripts.svelte"
import OAuth2Page from "@/settings/pages/oauth2/index.svelte"
import Recaptcha from "@/settings/pages/recaptcha.svelte"

const componentMap: Record<string, ComponentType> = {
  profile: ProfilePage,
  users: UsersPage,
  user: UserPage,
  user_invites: UserInvitesPage,
  group: GroupPage,
  groups: GroupsPage,
  plugins: PluginsPage,
  email: EmailPage,
  email_imap: EmailImapPage,
  email_templates: EmailTemplatesPage,
  email_template: EmailTemplatePage,
  audit_logs: AuditLogsPage,
  ai: AIPage,
  auth: AuthPage,
  org: OrgPage,
  branding: BrandingPage,
  environment: EnvironmentPage,
  version: VersionPage,
  diagnostics: DiagnosticsPage,
  system_logs: SystemLogsPage,
  upgrade: UpgradePage,
  usage: UsagePage,
  general_info: GeneralInfoPage,
  automations: AutomationsPage,
  backups: BackupsPage,
  pwa: PWAPage,
  embed: EmbedPage,
  scripts: ScriptsPage,
  oauth2: OAuth2Page,
  recaptcha: Recaptcha,
}

export const Pages = {
  get: (key: keyof typeof componentMap) => {
    const component = componentMap[key]
    if (!component) {
      console.error(`Component not found for key: ${key}`)
      return undefined
    }

    return component
  },
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
