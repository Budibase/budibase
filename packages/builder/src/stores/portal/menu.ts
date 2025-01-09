import { derived, Readable } from "svelte/store"
import { admin } from "./admin"
import { auth } from "./auth"
import { sdk } from "@budibase/shared-core"

interface MenuItem {
  title: string
  href: string
  subPages?: MenuItem[]
}

export const menu: Readable<MenuItem[]> = derived(
  [admin, auth],
  ([$admin, $auth]) => {
    const user = $auth?.user
    const isAdmin = user != null && sdk.users.isAdmin(user)
    const isGlobalBuilder = user != null && sdk.users.isGlobalBuilder(user)
    const cloud = $admin?.cloud

    // Determine user sub pages
    let userSubPages: MenuItem[] = [
      {
        title: "Users",
        href: "/builder/portal/users/users",
      },
    ]
    userSubPages.push({
      title: "Groups",
      href: "/builder/portal/users/groups",
    })

    // Pages that all devs and admins can access
    let menu: MenuItem[] = [
      {
        title: "Apps",
        href: "/builder/portal/apps",
      },
    ]
    if (isGlobalBuilder) {
      menu.push({
        title: "Users",
        href: "/builder/portal/users",
        subPages: userSubPages,
      })
      menu.push({
        title: "Plugins",
        href: "/builder/portal/plugins",
      })
    }

    // Add settings page for admins
    if (isAdmin) {
      let settingsSubPages: MenuItem[] = [
        {
          title: "Auth",
          href: "/builder/portal/settings/auth",
        },
        {
          title: "Email",
          href: "/builder/portal/settings/email",
        },
        {
          title: "Organisation",
          href: "/builder/portal/settings/organisation",
        },
        {
          title: "Branding",
          href: "/builder/portal/settings/branding",
        },
        {
          title: "Environment",
          href: "/builder/portal/settings/environment",
        },
        {
          title: "AI",
          href: "/builder/portal/settings/ai",
        },
      ]

      if (!cloud) {
        settingsSubPages.push({
          title: "Version",
          href: "/builder/portal/settings/version",
        })
        settingsSubPages.push({
          title: "Diagnostics",
          href: "/builder/portal/settings/diagnostics",
        })
      }
      menu.push({
        title: "Settings",
        href: "/builder/portal/settings",
        subPages: [...settingsSubPages].sort((a, b) =>
          a.title.localeCompare(b.title)
        ),
      })
    }

    // Add account page
    let accountSubPages: MenuItem[] = [
      {
        title: "Usage",
        href: "/builder/portal/account/usage",
      },
    ]
    if (isAdmin) {
      accountSubPages.push({
        title: "Audit Logs",
        href: "/builder/portal/account/auditLogs",
      })

      if (!cloud) {
        accountSubPages.push({
          title: "System Logs",
          href: "/builder/portal/account/systemLogs",
        })
      }
    }
    if (cloud && user?.accountPortalAccess) {
      accountSubPages.push({
        title: "Upgrade",
        href: $admin?.accountPortalUrl + "/portal/upgrade",
      })
    } else if (!cloud && isAdmin) {
      accountSubPages.push({
        title: "Upgrade",
        href: "/builder/portal/account/upgrade",
      })
    }
    // add license check here
    if (user?.accountPortalAccess && user?.account?.stripeCustomerId) {
      accountSubPages.push({
        title: "Billing",
        href: $admin?.accountPortalUrl + "/portal/billing",
      })
    }
    menu.push({
      title: "Account",
      href: "/builder/portal/account",
      subPages: accountSubPages,
    })

    return menu
  }
)
