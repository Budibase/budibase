import { derived } from "svelte/store"
import { isEnabled, TENANT_FEATURE_FLAGS } from "helpers/featureFlags"
import { admin } from "./admin"
import { auth } from "./auth"

export const menu = derived([admin, auth], ([$admin, $auth]) => {
  // Standard user and developer pages
  let menu = [
    {
      title: "Apps",
      href: "/builder/portal/apps",
    },
    {
      title: "Plugins",
      href: "/builder/portal/plugins",
    },
  ]

  // Admin only pages
  if ($auth.isAdmin) {
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

    // Determine settings sub pages
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
    ]
    if (!$admin.cloud) {
      settingsSubPages.push({
        title: "Version",
        href: "/builder/portal/settings/version",
      })
    }

    menu = [
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
      {
        title: "Settings",
        href: "/builder/portal/settings",
        subPages: settingsSubPages,
      },
    ]
  }

  // Check if allowed access to account section
  if (
    isEnabled(TENANT_FEATURE_FLAGS.LICENSING) &&
    ($auth?.user?.accountPortalAccess || (!$admin.cloud && $auth.isAdmin))
  ) {
    // Determine account sub pages
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
    } else if (!$admin.cloud && admin) {
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
