import { sdk, helpers } from "@budibase/shared-core"
import { GetGlobalSelfResponse } from "@budibase/types"
import { UserAvatar } from "@budibase/frontend-core"

import { Target, type Route } from "@/types/routing"
import { Pages } from "./pages"
import { AdminState } from "@/stores/portal/admin"
import { AppMetaState } from "@/stores/builder/app"
import { PortalAppsStore } from "@/stores/portal/apps"
import { StoreApp } from "@/types"

export const globalRoutes = (user: GetGlobalSelfResponse) => {
  return [
    {
      section: "Preferences",
      path: "profile",
      icon: {
        comp: UserAvatar,
        props: { user, size: "XS" },
      },
      comp: Pages.get("profile"),
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
      comp: Pages.get("email"),
    },
    {
      path: "templates",
      title: "Templates",
      comp: Pages.get("email_templates"),
      routes: [
        {
          path: ":templateId",
          title: "Template",
          comp: Pages.get("email_template"),
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
          comp: Pages.get("usage"),
        },
        {
          path: "org",
          access: () => isAdmin,
          title: "Organisation",
          comp: Pages.get("org"),
        },
        {
          path: "branding",
          access: () => isAdmin,
          title: "Branding",
          comp: Pages.get("branding"),
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
          path: "users",
          title: "Users",
          comp: Pages.get("users"),
          routes: [{ path: ":userId", comp: Pages.get("user"), title: "User" }],
        },
        {
          path: "invites",
          title: "Invites",
          comp: Pages.get("user_invites"),
        },
        {
          path: "groups",
          title: "Groups",
          comp: Pages.get("groups"),
          routes: [
            { path: ":groupId", comp: Pages.get("group"), title: "Group" },
          ],
        },
      ],
    },
    {
      section: "Plugins",
      access: () => isGlobalBuilder,
      path: "plugins",
      icon: "plug",
      comp: Pages.get("plugins"),
    },
    {
      section: "Environment",
      access: () => isAdmin,
      path: "environment",
      icon: "shipping-container",
      comp: Pages.get("environment"),
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
      comp: Pages.get("ai"),
    },
    {
      section: "Auth",
      access: () => isAdmin,
      path: "auth",
      icon: "key",
      comp: Pages.get("auth"),
    },
    {
      section: "Recaptcha",
      access: () => isAdmin,
      path: "recaptcha",
      icon: "shield-check",
      comp: Pages.get("recaptcha"),
    },
    {
      section: "Audit logs",
      access: () => isAdmin,
      path: "audit",
      icon: "notepad",
      comp: Pages.get("audit_logs"),
    },
    {
      section: "Self host",
      access: () => !cloud && isAdmin,
      path: "self",
      icon: "computer-tower",
      routes: [
        {
          path: "version",
          comp: Pages.get("version"),
          title: "Version",
        },
        {
          path: "diagnostics",
          comp: Pages.get("diagnostics"),
          title: "Diagnostics",
        },
        {
          path: "systemLogs",
          comp: Pages.get("system_logs"),
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
      comp: Pages.get("upgrade"),
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

export const appRoutes = (
  appStore: AppMetaState,
  appsStore: PortalAppsStore
): Route[] => {
  if (!appStore?.appId) {
    return []
  }

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
        { path: "info", comp: Pages.get("general_info"), title: "Info" },
        {
          path: "backups",
          comp: Pages.get("backups"),
          title: "Backups",
          error: () => backupErrorCount > 0,
        },
        {
          title: "OAuth2",
          path: "oauth2",
          comp: Pages.get("oauth2"),
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
          comp: Pages.get("automations"),
        },
      ],
    },
    {
      section: "Apps",
      icon: "layout",
      path: "app",
      routes: [
        { path: "pwa", comp: Pages.get("pwa"), title: "PWA" },
        { path: "embed", comp: Pages.get("embed"), title: "Embed" },
        { path: "scripts", comp: Pages.get("scripts"), title: "Scripts" },
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
