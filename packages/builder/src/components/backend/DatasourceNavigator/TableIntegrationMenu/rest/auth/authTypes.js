import { _ } from "../../../../../../../lang/i18n"

export const AUTH_TYPES = {
  BASIC: "basic",
  BEARER: "bearer",
}

export const AUTH_TYPE_LABELS = [
  {
    label: $_(
      "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.auth.authTypes.Basic_Auth"
    ),
    value: AUTH_TYPES.BASIC,
  },
  {
    label: $_(
      "components.backend.DatasourceNavigation.TableIntegrationMenu.rest.auth.authTypes.Bearer_Token"
    ),
    value: AUTH_TYPES.BEARER,
  },
]
