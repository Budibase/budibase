import { Target, type Route } from "@/types/routing"
import * as Pages from "./pages"

import { sdk } from "@budibase/shared-core"
import { GetGlobalSelfResponse } from "@budibase/types"
import { AdminState } from "@/stores/portal/admin"
import { AppMetaState } from "@/stores/builder/app"
import { UserAvatar } from "@budibase/frontend-core"

export const globalRoutes = (user: GetGlobalSelfResponse) => {
  return [
    {
      section: "Preferences",
      path: "profile",
      icon: {
        comp: UserAvatar,
        props: { user, size: "XS" },
      },
      comp: Pages.lazy("profile"),
    },
  ]
}

// Route definitions
export const orgRoutes = (
  user: GetGlobalSelfResponse,
  admin: AdminState
): Route[] => {
  const isAdmin = user != null && sdk.users.isAdmin(user)
  const isGlobalBuilder = user != null && sdk.users.isGlobalBuilder(user)
  const cloud = admin?.cloud

  return [
    {
      section: "Account",
      path: "account",
      icon: "sliders",
      routes: [
        {
          path: "usage",
          title: "Usage",
          comp: Pages.lazy("usage"),
        },
        {
          path: "org",
          access: () => isAdmin,
          title: "Organisation",
          comp: Pages.lazy("org"),
        },
        {
          path: "branding",
          access: () => isAdmin,
          title: "Branding",
          comp: Pages.lazy("branding"),
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
          comp: Pages.lazy("users"),
          routes: [
            { path: ":userId", comp: Pages.lazy("user"), title: "User" },
          ],
        },
        {
          path: "invites",
          title: "Invites",
          comp: Pages.lazy("user_invites"),
        },
        {
          path: "groups",
          title: "Groups",
          comp: Pages.lazy("groups"),
          routes: [
            { path: ":groupId", comp: Pages.lazy("group"), title: "Group" },
          ],
        },
      ],
    },
    {
      section: "Plugins",
      access: () => isGlobalBuilder,
      path: "plugins",
      icon: "plug",
      comp: Pages.lazy("plugins"),
    },
    {
      section: "Environment",
      access: () => isAdmin,
      path: "environment",
      icon: "shipping-container",
      comp: Pages.lazy("environment"),
    },
    {
      section: "Email",
      path: "email",
      icon: "envelope",
      access: () => isAdmin,
      routes: [
        {
          path: "smtp",
          title: "SMTP",
          comp: Pages.lazy("email"),
        },
        {
          path: "templates",
          title: "Templates",
          comp: Pages.lazy("email_templates"),
          routes: [
            {
              path: ":templateId",
              title: "Template",
              comp: Pages.lazy("email_template"),
            },
          ],
        },
      ],
    },
    {
      section: "AI",
      access: () => isAdmin,
      path: "ai",
      icon: "sparkle",
      comp: Pages.lazy("ai"),
    },
    {
      section: "Auth",
      access: () => isAdmin,
      path: "auth",
      icon: "key",
      comp: Pages.lazy("auth"),
    },
    {
      section: "Audit logs",
      access: () => isAdmin,
      path: "audit",
      icon: "notepad",
      comp: Pages.lazy("audit_logs"),
    },
    {
      section: "Self host",
      access: () => !cloud && isAdmin,
      path: "self",
      icon: "computer-tower",
      routes: [
        {
          path: "version",
          comp: Pages.lazy("version"),
          title: "Version",
        },
        {
          path: "diagnostics",
          comp: Pages.lazy("diagnostics"),
          title: "Diagnostics",
        },
        {
          path: "systemLogs",
          comp: Pages.lazy("system_logs"),
          title: "System logs",
        },
      ],
    },
    {
      section: "Upgrade plan",
      access: () => cloud && user?.accountPortalAccess,
      icon: "arrow-circle-up",
      href: {
        url: admin?.accountPortalUrl + "/portal/upgrade",
        target: Target.Blank,
      },
    },
    {
      section: "Upgrade plan",
      access: () => !cloud && isAdmin,
      icon: "arrow-circle-up",
      path: "upgrade",
      comp: Pages.lazy("upgrade"),
      color: "var(--spectrum-global-color-blue-500)",
    },
    {
      section: "Billing",
      access: () =>
        !!(user?.accountPortalAccess && user?.account?.stripeCustomerId),
      path: "billing",
      icon: "credit-card",
      href: {
        url: admin?.accountPortalUrl + "/portal/billing",
        target: Target.Blank,
      },
    },
  ].map((entry: Route) => ({
    ...entry,
    group: "Organisation",
  }))
}

export const appRoutes = (appStore: AppMetaState): Route[] => {
  if (!appStore?.appId) {
    return []
  }

  return [
    {
      section: "General",
      icon: "sliders-horizontal",
      path: "general",
      routes: [
        { path: "info", comp: Pages.lazy("general_info"), title: "Info" },
        {
          path: "backups",
          comp: Pages.lazy("backups"),
          title: "Backups",
        },
        {
          section: "Data",
          icon: "lock-simple",
          path: "data",
          routes: [{ path: "oauth2", comp: Pages.lazy("oauth2") }],
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
          comp: Pages.lazy("automations"),
        },
      ],
    },
    {
      section: "Apps",
      icon: "layout",
      path: "app",
      routes: [
        { path: "pwa", comp: Pages.lazy("pwa"), title: "PWA" },
        { path: "embed", comp: Pages.lazy("embed"), title: "Embed" },
        { path: "scripts", comp: Pages.lazy("scripts"), title: "Scripts" },
      ],
    },
  ].map((entry: Route) => ({
    ...entry,
    group: "This workspace",
  }))
}

// Parse out routes that shouldn't be visible if the user
// doesn't have permission or the install does not require/allow it
export const filterRoutes = (routes: Route[]): Route[] =>
  routes
    .filter(e => (typeof e.access === "function" ? e.access() : true))
    .map(route => ({
      ...route,
      ...(route?.routes ? { routes: filterRoutes(route.routes) } : {}),
    }))
