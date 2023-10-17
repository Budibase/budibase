
/**
 * @roxi/routify 2.18.0
 * File generated Tue Oct 17 2023 10:44:43 GMT+0200 (GMT+02:00)
 */

export const __version = "2.18.0"
export const __timestamp = "2023-10-17T08:44:43.719Z"

//buildRoutes
import { buildClientTree } from "@roxi/routify/runtime/buildRoutes"

//imports
import _auth_forgot from '../src/pages/auth/forgot.svelte'
import _auth_index from '../src/pages/auth/index.svelte'
import _auth_login from '../src/pages/auth/login.svelte'
import _auth_reset from '../src/pages/auth/reset.svelte'
import _auth__layout from '../src/pages/auth/_layout.svelte'
import _index from '../src/pages/index.svelte'
import _portal_account from '../src/pages/portal/account.svelte'
import _portal_billing from '../src/pages/portal/billing.svelte'
import _portal_comparisonTable from '../src/pages/portal/comparisonTable.svelte'
import _portal_index from '../src/pages/portal/index.svelte'
import _portal_install_digitalOcean from '../src/pages/portal/install/digital-ocean.svelte'
import _portal_install_docker from '../src/pages/portal/install/docker.svelte'
import _portal_install_index from '../src/pages/portal/install/index.svelte'
import _portal_install_kubernetes from '../src/pages/portal/install/kubernetes.svelte'
import _portal_licenseKey from '../src/pages/portal/licenseKey.svelte'
import _portal_upgrade from '../src/pages/portal/upgrade.svelte'
import _portal__layout from '../src/pages/portal/_layout.svelte'
import _register_build from '../src/pages/register/build.svelte'
import _register_complete from '../src/pages/register/complete.svelte'
import _register_details from '../src/pages/register/details.svelte'
import _register_hosting from '../src/pages/register/hosting.svelte'
import _register_index from '../src/pages/register/index.svelte'
import _register_personal from '../src/pages/register/personal.svelte'
import _register_team from '../src/pages/register/team.svelte'
import _register_verify from '../src/pages/register/verify.svelte'
import _register__layout from '../src/pages/register/_layout.svelte'
import __layout from '../src/pages/_layout.svelte'

//options
export const options = {}

//tree
export const _tree = {
  "name": "_layout",
  "filepath": "/_layout.svelte",
  "root": true,
  "ownMeta": {},
  "absolutePath": "/Users/adrinr/code/budibase/apps/account-portal/packages/ui/src/pages/_layout.svelte",
  "children": [
    {
      "isFile": true,
      "isDir": true,
      "file": "_layout.svelte",
      "filepath": "/auth/_layout.svelte",
      "name": "_layout",
      "ext": "svelte",
      "badExt": false,
      "absolutePath": "/Users/adrinr/code/budibase/apps/account-portal/packages/ui/src/pages/auth/_layout.svelte",
      "children": [
        {
          "isFile": true,
          "isDir": false,
          "file": "forgot.svelte",
          "filepath": "/auth/forgot.svelte",
          "name": "forgot",
          "ext": "svelte",
          "badExt": false,
          "absolutePath": "/Users/adrinr/code/budibase/apps/account-portal/packages/ui/src/pages/auth/forgot.svelte",
          "importPath": "../src/pages/auth/forgot.svelte",
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": true,
          "ownMeta": {},
          "meta": {
            "recursive": true,
            "preload": false,
            "prerender": true
          },
          "path": "/auth/forgot",
          "id": "_auth_forgot",
          "component": () => _auth_forgot
        },
        {
          "isFile": true,
          "isDir": false,
          "file": "index.svelte",
          "filepath": "/auth/index.svelte",
          "name": "index",
          "ext": "svelte",
          "badExt": false,
          "absolutePath": "/Users/adrinr/code/budibase/apps/account-portal/packages/ui/src/pages/auth/index.svelte",
          "importPath": "../src/pages/auth/index.svelte",
          "isLayout": false,
          "isReset": false,
          "isIndex": true,
          "isFallback": false,
          "isPage": true,
          "ownMeta": {},
          "meta": {
            "recursive": true,
            "preload": false,
            "prerender": true
          },
          "path": "/auth/index",
          "id": "_auth_index",
          "component": () => _auth_index
        },
        {
          "isFile": true,
          "isDir": false,
          "file": "login.svelte",
          "filepath": "/auth/login.svelte",
          "name": "login",
          "ext": "svelte",
          "badExt": false,
          "absolutePath": "/Users/adrinr/code/budibase/apps/account-portal/packages/ui/src/pages/auth/login.svelte",
          "importPath": "../src/pages/auth/login.svelte",
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": true,
          "ownMeta": {},
          "meta": {
            "recursive": true,
            "preload": false,
            "prerender": true
          },
          "path": "/auth/login",
          "id": "_auth_login",
          "component": () => _auth_login
        },
        {
          "isFile": true,
          "isDir": false,
          "file": "reset.svelte",
          "filepath": "/auth/reset.svelte",
          "name": "reset",
          "ext": "svelte",
          "badExt": false,
          "absolutePath": "/Users/adrinr/code/budibase/apps/account-portal/packages/ui/src/pages/auth/reset.svelte",
          "importPath": "../src/pages/auth/reset.svelte",
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": true,
          "ownMeta": {},
          "meta": {
            "recursive": true,
            "preload": false,
            "prerender": true
          },
          "path": "/auth/reset",
          "id": "_auth_reset",
          "component": () => _auth_reset
        }
      ],
      "isLayout": true,
      "isReset": false,
      "isIndex": false,
      "isFallback": false,
      "isPage": false,
      "importPath": "../src/pages/auth/_layout.svelte",
      "ownMeta": {},
      "meta": {
        "recursive": true,
        "preload": false,
        "prerender": true
      },
      "path": "/auth",
      "id": "_auth__layout",
      "component": () => _auth__layout
    },
    {
      "isFile": true,
      "isDir": false,
      "file": "index.svelte",
      "filepath": "/index.svelte",
      "name": "index",
      "ext": "svelte",
      "badExt": false,
      "absolutePath": "/Users/adrinr/code/budibase/apps/account-portal/packages/ui/src/pages/index.svelte",
      "importPath": "../src/pages/index.svelte",
      "isLayout": false,
      "isReset": false,
      "isIndex": true,
      "isFallback": false,
      "isPage": true,
      "ownMeta": {},
      "meta": {
        "recursive": true,
        "preload": false,
        "prerender": true
      },
      "path": "/index",
      "id": "_index",
      "component": () => _index
    },
    {
      "isFile": true,
      "isDir": true,
      "file": "_layout.svelte",
      "filepath": "/portal/_layout.svelte",
      "name": "_layout",
      "ext": "svelte",
      "badExt": false,
      "absolutePath": "/Users/adrinr/code/budibase/apps/account-portal/packages/ui/src/pages/portal/_layout.svelte",
      "children": [
        {
          "isFile": true,
          "isDir": false,
          "file": "account.svelte",
          "filepath": "/portal/account.svelte",
          "name": "account",
          "ext": "svelte",
          "badExt": false,
          "absolutePath": "/Users/adrinr/code/budibase/apps/account-portal/packages/ui/src/pages/portal/account.svelte",
          "importPath": "../src/pages/portal/account.svelte",
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": true,
          "ownMeta": {},
          "meta": {
            "recursive": true,
            "preload": false,
            "prerender": true
          },
          "path": "/portal/account",
          "id": "_portal_account",
          "component": () => _portal_account
        },
        {
          "isFile": true,
          "isDir": false,
          "file": "billing.svelte",
          "filepath": "/portal/billing.svelte",
          "name": "billing",
          "ext": "svelte",
          "badExt": false,
          "absolutePath": "/Users/adrinr/code/budibase/apps/account-portal/packages/ui/src/pages/portal/billing.svelte",
          "importPath": "../src/pages/portal/billing.svelte",
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": true,
          "ownMeta": {},
          "meta": {
            "recursive": true,
            "preload": false,
            "prerender": true
          },
          "path": "/portal/billing",
          "id": "_portal_billing",
          "component": () => _portal_billing
        },
        {
          "isFile": true,
          "isDir": false,
          "file": "comparisonTable.svelte",
          "filepath": "/portal/comparisonTable.svelte",
          "name": "comparisonTable",
          "ext": "svelte",
          "badExt": false,
          "absolutePath": "/Users/adrinr/code/budibase/apps/account-portal/packages/ui/src/pages/portal/comparisonTable.svelte",
          "importPath": "../src/pages/portal/comparisonTable.svelte",
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": true,
          "ownMeta": {},
          "meta": {
            "recursive": true,
            "preload": false,
            "prerender": true
          },
          "path": "/portal/comparisonTable",
          "id": "_portal_comparisonTable",
          "component": () => _portal_comparisonTable
        },
        {
          "isFile": true,
          "isDir": false,
          "file": "index.svelte",
          "filepath": "/portal/index.svelte",
          "name": "index",
          "ext": "svelte",
          "badExt": false,
          "absolutePath": "/Users/adrinr/code/budibase/apps/account-portal/packages/ui/src/pages/portal/index.svelte",
          "importPath": "../src/pages/portal/index.svelte",
          "isLayout": false,
          "isReset": false,
          "isIndex": true,
          "isFallback": false,
          "isPage": true,
          "ownMeta": {},
          "meta": {
            "recursive": true,
            "preload": false,
            "prerender": true
          },
          "path": "/portal/index",
          "id": "_portal_index",
          "component": () => _portal_index
        },
        {
          "isFile": false,
          "isDir": true,
          "file": "install",
          "filepath": "/portal/install",
          "name": "install",
          "ext": "",
          "badExt": false,
          "absolutePath": "/Users/adrinr/code/budibase/apps/account-portal/packages/ui/src/pages/portal/install",
          "children": [
            {
              "isFile": true,
              "isDir": false,
              "file": "digital-ocean.svelte",
              "filepath": "/portal/install/digital-ocean.svelte",
              "name": "digital-ocean",
              "ext": "svelte",
              "badExt": false,
              "absolutePath": "/Users/adrinr/code/budibase/apps/account-portal/packages/ui/src/pages/portal/install/digital-ocean.svelte",
              "importPath": "../src/pages/portal/install/digital-ocean.svelte",
              "isLayout": false,
              "isReset": false,
              "isIndex": false,
              "isFallback": false,
              "isPage": true,
              "ownMeta": {},
              "meta": {
                "recursive": true,
                "preload": false,
                "prerender": true
              },
              "path": "/portal/install/digital-ocean",
              "id": "_portal_install_digitalOcean",
              "component": () => _portal_install_digitalOcean
            },
            {
              "isFile": true,
              "isDir": false,
              "file": "docker.svelte",
              "filepath": "/portal/install/docker.svelte",
              "name": "docker",
              "ext": "svelte",
              "badExt": false,
              "absolutePath": "/Users/adrinr/code/budibase/apps/account-portal/packages/ui/src/pages/portal/install/docker.svelte",
              "importPath": "../src/pages/portal/install/docker.svelte",
              "isLayout": false,
              "isReset": false,
              "isIndex": false,
              "isFallback": false,
              "isPage": true,
              "ownMeta": {},
              "meta": {
                "recursive": true,
                "preload": false,
                "prerender": true
              },
              "path": "/portal/install/docker",
              "id": "_portal_install_docker",
              "component": () => _portal_install_docker
            },
            {
              "isFile": true,
              "isDir": false,
              "file": "index.svelte",
              "filepath": "/portal/install/index.svelte",
              "name": "index",
              "ext": "svelte",
              "badExt": false,
              "absolutePath": "/Users/adrinr/code/budibase/apps/account-portal/packages/ui/src/pages/portal/install/index.svelte",
              "importPath": "../src/pages/portal/install/index.svelte",
              "isLayout": false,
              "isReset": false,
              "isIndex": true,
              "isFallback": false,
              "isPage": true,
              "ownMeta": {},
              "meta": {
                "recursive": true,
                "preload": false,
                "prerender": true
              },
              "path": "/portal/install/index",
              "id": "_portal_install_index",
              "component": () => _portal_install_index
            },
            {
              "isFile": true,
              "isDir": false,
              "file": "kubernetes.svelte",
              "filepath": "/portal/install/kubernetes.svelte",
              "name": "kubernetes",
              "ext": "svelte",
              "badExt": false,
              "absolutePath": "/Users/adrinr/code/budibase/apps/account-portal/packages/ui/src/pages/portal/install/kubernetes.svelte",
              "importPath": "../src/pages/portal/install/kubernetes.svelte",
              "isLayout": false,
              "isReset": false,
              "isIndex": false,
              "isFallback": false,
              "isPage": true,
              "ownMeta": {},
              "meta": {
                "recursive": true,
                "preload": false,
                "prerender": true
              },
              "path": "/portal/install/kubernetes",
              "id": "_portal_install_kubernetes",
              "component": () => _portal_install_kubernetes
            }
          ],
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": false,
          "ownMeta": {},
          "meta": {
            "recursive": true,
            "preload": false,
            "prerender": true
          },
          "path": "/portal/install"
        },
        {
          "isFile": true,
          "isDir": false,
          "file": "licenseKey.svelte",
          "filepath": "/portal/licenseKey.svelte",
          "name": "licenseKey",
          "ext": "svelte",
          "badExt": false,
          "absolutePath": "/Users/adrinr/code/budibase/apps/account-portal/packages/ui/src/pages/portal/licenseKey.svelte",
          "importPath": "../src/pages/portal/licenseKey.svelte",
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": true,
          "ownMeta": {},
          "meta": {
            "recursive": true,
            "preload": false,
            "prerender": true
          },
          "path": "/portal/licenseKey",
          "id": "_portal_licenseKey",
          "component": () => _portal_licenseKey
        },
        {
          "isFile": true,
          "isDir": false,
          "file": "upgrade.svelte",
          "filepath": "/portal/upgrade.svelte",
          "name": "upgrade",
          "ext": "svelte",
          "badExt": false,
          "absolutePath": "/Users/adrinr/code/budibase/apps/account-portal/packages/ui/src/pages/portal/upgrade.svelte",
          "importPath": "../src/pages/portal/upgrade.svelte",
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": true,
          "ownMeta": {},
          "meta": {
            "recursive": true,
            "preload": false,
            "prerender": true
          },
          "path": "/portal/upgrade",
          "id": "_portal_upgrade",
          "component": () => _portal_upgrade
        }
      ],
      "isLayout": true,
      "isReset": false,
      "isIndex": false,
      "isFallback": false,
      "isPage": false,
      "importPath": "../src/pages/portal/_layout.svelte",
      "ownMeta": {},
      "meta": {
        "recursive": true,
        "preload": false,
        "prerender": true
      },
      "path": "/portal",
      "id": "_portal__layout",
      "component": () => _portal__layout
    },
    {
      "isFile": true,
      "isDir": true,
      "file": "_layout.svelte",
      "filepath": "/register/_layout.svelte",
      "name": "_layout",
      "ext": "svelte",
      "badExt": false,
      "absolutePath": "/Users/adrinr/code/budibase/apps/account-portal/packages/ui/src/pages/register/_layout.svelte",
      "children": [
        {
          "isFile": true,
          "isDir": false,
          "file": "build.svelte",
          "filepath": "/register/build.svelte",
          "name": "build",
          "ext": "svelte",
          "badExt": false,
          "absolutePath": "/Users/adrinr/code/budibase/apps/account-portal/packages/ui/src/pages/register/build.svelte",
          "importPath": "../src/pages/register/build.svelte",
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": true,
          "ownMeta": {},
          "meta": {
            "recursive": true,
            "preload": false,
            "prerender": true
          },
          "path": "/register/build",
          "id": "_register_build",
          "component": () => _register_build
        },
        {
          "isFile": true,
          "isDir": false,
          "file": "complete.svelte",
          "filepath": "/register/complete.svelte",
          "name": "complete",
          "ext": "svelte",
          "badExt": false,
          "absolutePath": "/Users/adrinr/code/budibase/apps/account-portal/packages/ui/src/pages/register/complete.svelte",
          "importPath": "../src/pages/register/complete.svelte",
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": true,
          "ownMeta": {},
          "meta": {
            "recursive": true,
            "preload": false,
            "prerender": true
          },
          "path": "/register/complete",
          "id": "_register_complete",
          "component": () => _register_complete
        },
        {
          "isFile": true,
          "isDir": false,
          "file": "details.svelte",
          "filepath": "/register/details.svelte",
          "name": "details",
          "ext": "svelte",
          "badExt": false,
          "absolutePath": "/Users/adrinr/code/budibase/apps/account-portal/packages/ui/src/pages/register/details.svelte",
          "importPath": "../src/pages/register/details.svelte",
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": true,
          "ownMeta": {},
          "meta": {
            "recursive": true,
            "preload": false,
            "prerender": true
          },
          "path": "/register/details",
          "id": "_register_details",
          "component": () => _register_details
        },
        {
          "isFile": true,
          "isDir": false,
          "file": "hosting.svelte",
          "filepath": "/register/hosting.svelte",
          "name": "hosting",
          "ext": "svelte",
          "badExt": false,
          "absolutePath": "/Users/adrinr/code/budibase/apps/account-portal/packages/ui/src/pages/register/hosting.svelte",
          "importPath": "../src/pages/register/hosting.svelte",
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": true,
          "ownMeta": {},
          "meta": {
            "recursive": true,
            "preload": false,
            "prerender": true
          },
          "path": "/register/hosting",
          "id": "_register_hosting",
          "component": () => _register_hosting
        },
        {
          "isFile": true,
          "isDir": false,
          "file": "index.svelte",
          "filepath": "/register/index.svelte",
          "name": "index",
          "ext": "svelte",
          "badExt": false,
          "absolutePath": "/Users/adrinr/code/budibase/apps/account-portal/packages/ui/src/pages/register/index.svelte",
          "importPath": "../src/pages/register/index.svelte",
          "isLayout": false,
          "isReset": false,
          "isIndex": true,
          "isFallback": false,
          "isPage": true,
          "ownMeta": {},
          "meta": {
            "recursive": true,
            "preload": false,
            "prerender": true
          },
          "path": "/register/index",
          "id": "_register_index",
          "component": () => _register_index
        },
        {
          "isFile": true,
          "isDir": false,
          "file": "personal.svelte",
          "filepath": "/register/personal.svelte",
          "name": "personal",
          "ext": "svelte",
          "badExt": false,
          "absolutePath": "/Users/adrinr/code/budibase/apps/account-portal/packages/ui/src/pages/register/personal.svelte",
          "importPath": "../src/pages/register/personal.svelte",
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": true,
          "ownMeta": {},
          "meta": {
            "recursive": true,
            "preload": false,
            "prerender": true
          },
          "path": "/register/personal",
          "id": "_register_personal",
          "component": () => _register_personal
        },
        {
          "isFile": true,
          "isDir": false,
          "file": "team.svelte",
          "filepath": "/register/team.svelte",
          "name": "team",
          "ext": "svelte",
          "badExt": false,
          "absolutePath": "/Users/adrinr/code/budibase/apps/account-portal/packages/ui/src/pages/register/team.svelte",
          "importPath": "../src/pages/register/team.svelte",
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": true,
          "ownMeta": {},
          "meta": {
            "recursive": true,
            "preload": false,
            "prerender": true
          },
          "path": "/register/team",
          "id": "_register_team",
          "component": () => _register_team
        },
        {
          "isFile": true,
          "isDir": false,
          "file": "verify.svelte",
          "filepath": "/register/verify.svelte",
          "name": "verify",
          "ext": "svelte",
          "badExt": false,
          "absolutePath": "/Users/adrinr/code/budibase/apps/account-portal/packages/ui/src/pages/register/verify.svelte",
          "importPath": "../src/pages/register/verify.svelte",
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": true,
          "ownMeta": {},
          "meta": {
            "recursive": true,
            "preload": false,
            "prerender": true
          },
          "path": "/register/verify",
          "id": "_register_verify",
          "component": () => _register_verify
        }
      ],
      "isLayout": true,
      "isReset": false,
      "isIndex": false,
      "isFallback": false,
      "isPage": false,
      "importPath": "../src/pages/register/_layout.svelte",
      "ownMeta": {},
      "meta": {
        "recursive": true,
        "preload": false,
        "prerender": true
      },
      "path": "/register",
      "id": "_register__layout",
      "component": () => _register__layout
    }
  ],
  "isLayout": true,
  "isReset": false,
  "isIndex": false,
  "isFallback": false,
  "isPage": false,
  "isFile": true,
  "file": "_layout.svelte",
  "ext": "svelte",
  "badExt": false,
  "importPath": "../src/pages/_layout.svelte",
  "meta": {
    "recursive": true,
    "preload": false,
    "prerender": true
  },
  "path": "/",
  "id": "__layout",
  "component": () => __layout
}


export const {tree, routes} = buildClientTree(_tree)

