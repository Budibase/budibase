import { derived } from "svelte/store"
import { isEnabled, TENANT_FEATURE_FLAGS } from "helpers/featureFlags"
import { admin } from "./admin"
import { auth } from "./auth"

export const menu = derived([admin, auth], ([$admin, $auth]) => {
  // Determine user sub pages
  let userSubPages = [
    {
      title: "Users",
      href: "/builder/portal/users/users",
    },
  ]
  if (isEnabled(TENANT_FEATURE_FLAGS.USER_GROUPS)) {
    userSubPages.push({
      title: "Groups",
      href: "/builder/portal/users/groups",
    })
  }

  // Pages that all devs and admins can access
  let menu = [
    {
      title: "Apps",
      href: "/builder/portal/apps",
    },
    {
      title: "Users",
      href: "/builder/portal/users",
      subPages: userSubPages,
    },
    {
      title: "Plugins",
      href: "/builder/portal/plugins",
    },
  ]

  // Add settings page for admins
  if ($auth.isAdmin) {
    let settingsSubPages = [
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
        title: "Environment",
        href: "/builder/portal/settings/environment",
      },
    ]
    if (!$admin.cloud) {
      settingsSubPages.push({
        title: "Version",
        href: "/builder/portal/settings/version",
      })
    }
    menu.push({
      title: "Settings",
      href: "/builder/portal/settings",
      subPages: settingsSubPages,
    })
  }

  // Add account page
  if (isEnabled(TENANT_FEATURE_FLAGS.LICENSING)) {
    let accountSubPages = [
      {
        title: "Usage",
        href: "/builder/portal/account/usage",
      },
    ]
    if ($admin.cloud && $auth?.user?.accountPortalAccess) {
      accountSubPages.push({
        title: "Upgrade",
        href: $admin.accountPortalUrl + "/portal/upgrade",
      })
    } else if (!$admin.cloud && $auth.isAdmin) {
      accountSubPages.push({
        title: "Upgrade",
        href: "/builder/portal/account/upgrade",
      })
    }
    if (
      $auth?.user?.accountPortalAccess &&
      $auth.user.account.stripeCustomerId
    ) {
      accountSubPages.push({
        title: "Billing",
        href: $admin.accountPortalUrl + "/portal/billing",
      })
    }
    menu.push({
      title: "Account",
      href: "/builder/portal/account",
      subPages: accountSubPages,
    })
  }

  return menu
})
