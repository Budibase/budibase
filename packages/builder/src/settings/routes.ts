import { sdk, helpers } from "@budibase/shared-core"
import {
  AIConfigType,
  FeatureFlag,
  GetGlobalSelfResponse,
} from "@budibase/types"
import { UserAvatar } from "@budibase/frontend-core"

import { Target, type Route } from "@/types/routing"
import { Pages } from "./pages"
import { AdminState } from "@/stores/portal/admin"
import { AppMetaState } from "@/stores/builder/app"
import { PortalAppsStore } from "@/stores/portal/apps"
import { StoreApp } from "@/types"
import { featureFlag } from "@/helpers"

export const globalRoutes = (user: GetGlobalSelfResponse) => {
  return [
    {
      section: "Preferences",
      path: "profile",
      icon: {
        component: UserAvatar,
        props: { user, size: "XS" },
      },
      component: Pages.get("profile"),
    },
  ]
}

// Route definitions
const { accountPortalUpgradeUrl, accountPortalBillingUrl } = helpers

export const orgRoutes = (
  user: GetGlobalSelfResponse,
  admin: AdminState
): Route[] => {
  const isAdmin = user != null && sdk.users.isAdmin(user)
  const isGlobalBuilder = user != null && sdk.users.isGlobalBuilder(user)
  const cloud = admin?.cloud

  const emailRoutes: Route[] = [
    {
      path: "smtp",
      title: "SMTP",
      component: Pages.get("email"),
    },
    {
      path: "templates",
      title: "Templates",
      component: Pages.get("email_templates"),
      routes: [
        {
          path: ":templateId",
          title: "Template",
          component: Pages.get("email_template"),
        },
      ],
    },
  ]

  return [
    {
      section: "Account",
      path: "account",
      icon: "sliders",
      routes: [
        {
          path: "usage",
          title: "Usage",
          component: Pages.get("usage"),
        },
        {
          path: "org",
          access: () => isAdmin,
          title: "Organisation",
          component: Pages.get("org"),
        },
        {
          path: "branding",
          access: () => isAdmin,
          title: "Branding",
          component: Pages.get("branding"),
        },
        {
          path: "translations",
          access: () => isAdmin,
          title: "Translations",
          component: Pages.get("translations"),
        },
      ],
    },
    {
      section: "People",
      access: () => isGlobalBuilder,
      path: "people",
      icon: "users",
      routes: [
        {
          path: "workspace",
          title: "Workspace",
          component: Pages.get("workspace_users"),
        },
        {
          path: "users",
          title: "Organisation",
          component: Pages.get("users"),
          routes: [
            { path: ":userId", component: Pages.get("user"), title: "User" },
          ],
        },
        {
          path: "invites",
          title: "Invites",
          component: Pages.get("user_invites"),
        },
        {
          path: "groups",
          title: "Groups",
          component: Pages.get("groups"),
          routes: [
            { path: ":groupId", component: Pages.get("group"), title: "Group" },
          ],
        },
      ],
    },
    {
      section: "Plugins",
      access: () => isGlobalBuilder,
      path: "plugins",
      icon: "plug",
      component: Pages.get("plugins"),
    },
    {
      section: "Environment",
      access: () => isAdmin,
      path: "environment",
      icon: "shipping-container",
      component: Pages.get("environment"),
    },
    {
      section: "Email",
      path: "email",
      icon: "envelope",
      access: () => isAdmin,
      routes: emailRoutes,
    },
    {
      section: "AI",
      access: () => isAdmin,
      path: "ai",
      icon: "sparkle",
      component: Pages.get("ai"),
    },
    {
      section: "Auth",
      access: () => isAdmin,
      path: "auth",
      icon: "key",
      component: Pages.get("auth"),
    },
    {
      section: "Recaptcha",
      access: () => isAdmin,
      path: "recaptcha",
      icon: "shield-check",
      component: Pages.get("recaptcha"),
    },
    {
      section: "Audit logs",
      access: () => isAdmin,
      path: "audit",
      icon: "notepad",
      component: Pages.get("audit_logs"),
    },
    {
      section: "Self host",
      access: () => !cloud && isAdmin,
      path: "self",
      icon: "computer-tower",
      routes: [
        {
          path: "version",
          component: Pages.get("version"),
          title: "Version",
        },
        {
          path: "diagnostics",
          component: Pages.get("diagnostics"),
          title: "Diagnostics",
        },
        {
          path: "systemLogs",
          component: Pages.get("system_logs"),
          title: "System logs",
        },
      ],
    },
    {
      section: "Upgrade plan",
      access: () => cloud && user?.accountPortalAccess,
      icon: "arrow-circle-up",
      href: {
        url: accountPortalUpgradeUrl(admin?.accountPortalUrl),
        target: Target.Blank,
      },
    },
    {
      section: "Upgrade plan",
      access: () => !cloud && isAdmin,
      icon: "arrow-circle-up",
      path: "upgrade",
      component: Pages.get("upgrade"),
      color: "var(--spectrum-global-color-blue-500)",
    },
    {
      section: "Billing",
      access: () =>
        !!(user?.accountPortalAccess && user?.account?.stripeCustomerId),
      path: "billing",
      icon: "credit-card",
      href: {
        url: accountPortalBillingUrl(admin?.accountPortalUrl),
        target: Target.Blank,
      },
    },
  ].map((entry: Route) => ({
    ...entry,
    group: "Organisation",
  }))
}

export const workspaceRoutes = (
  appStore: AppMetaState,
  appsStore: PortalAppsStore,
  user: GetGlobalSelfResponse
): Route[] => {
  if (!appStore?.appId) {
    return []
  }
  const isAdmin = user != null && sdk.users.isAdmin(user)
  const getBackupErrors = (apps: StoreApp[], appId: string) => {
    const target = apps.find(app => app.devId === appId)
    return target?.backupErrors || {}
  }

  const backupErrors = getBackupErrors(appsStore.apps || [], appStore?.appId)
  const backupErrorCount = Object.keys(backupErrors).length

  return [
    {
      section: "General",
      icon: "sliders-horizontal",
      path: "general",
      routes: [
        { path: "info", component: Pages.get("general_info"), title: "Info" },
        {
          path: "backups",
          component: Pages.get("backups"),
          title: "Backups",
          error: () => backupErrorCount > 0,
        },
        {
          title: "OAuth2",
          path: "oauth2",
          component: Pages.get("oauth2"),
        },
      ],
    },
    {
      section: "Connections",
      title: "Connections",
      access: () => isAdmin,
      path: "connections",
      icon: "cube",
      new: true,
      component: Pages.get("connections"),
      routes: [
        {
          title: "Create",
          path: "create",
          component: Pages.get("create_connection"),
          skipNav: true,
        },
        {
          title: "New connection",
          path: "new",
          component: Pages.get("connection"),
          skipNav: true,
          props: { create: true },
        },
        {
          title: "New connection from template",
          path: "new/:templateId",
          component: Pages.get("connection"),
          skipNav: true,
          props: { create: true },
        },
        {
          title: "Connection",
          path: ":id",
          component: Pages.get("connection"),
          skipNav: true,
        },
      ],
    },
    {
      section: "Automations",
      icon: "lightning-a",
      path: "automations",
      routes: [
        {
          path: "logs",
          component: Pages.get("automations"),
        },
      ],
    },
    {
      section: "Apps",
      icon: "layout",
      path: "app",
      routes: [
        { path: "pwa", component: Pages.get("pwa"), title: "PWA" },
        { path: "embed", component: Pages.get("embed"), title: "Embed" },
        { path: "scripts", component: Pages.get("scripts"), title: "Scripts" },
      ],
    },
    {
      section: "AI config",
      path: "ai-config",
      icon: "sparkle",
      access: () => featureFlag.isEnabled("AI_AGENTS"),
      routes: [
        {
          path: AIConfigType.COMPLETIONS,
          title: featureFlag.isEnabled(FeatureFlag.AI_RAG) ? "AI Configs" : "",
          component: Pages.get("ai_configs"),
          routes: [
            {
              path: ":configId",
              component: Pages.get("ai_config"),
              title: "AI config",
            },
          ],
        },
        {
          path: AIConfigType.EMBEDDINGS,
          title: "Embeddings",
          access: () => featureFlag.isEnabled(FeatureFlag.AI_RAG),
          component: Pages.get("embeddings"),
          routes: [
            {
              path: ":configId",
              component: Pages.get("ai_config"),
              title: "AI config",
            },
          ],
        },
      ],
    },
  ].map((entry: Route) => ({
    ...entry,
    group: "Workspace",
  }))
}

// Parse out routes that shouldn't be visible if the user
// doesn't have permission or the install does not require/allow it
export const filterRoutes = (routes: Route[]): Route[] =>
  routes
    .filter(e => (typeof e.access === "function" ? e.access() : true))
    .map(route => {
      const filteredChildRoutes = route?.routes
        ? filterRoutes(route.routes)
        : []

      // Check if any child has an error
      const hasChildError = filteredChildRoutes.some(
        child => child.error?.() || false
      )

      // Check if this route itself has an error
      const hasOwnError = route.error?.() || false

      return {
        ...route,
        ...(route?.routes ? { routes: filteredChildRoutes } : {}),
        ...(hasOwnError || hasChildError ? { error: () => true } : {}),
      }
    })
