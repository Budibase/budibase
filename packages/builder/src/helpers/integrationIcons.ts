import ICONS from "@/components/backend/DatasourceNavigator/icons"
import { integrations } from "@/stores/builder/integrations"
import { get } from "svelte/store"
import type { ComponentType } from "svelte"

type IntegrationIcon = (typeof ICONS)[keyof typeof ICONS]

export type IconInfo =
  | { icon: IntegrationIcon | ComponentType; url?: never }
  | { url: string; icon?: never }

export const getIntegrationIcon = (
  integrationType: string,
  schema?: unknown,
  iconUrl?: string
): IconInfo | undefined => {
  const integrationList = get(integrations)
  if (!integrationList) {
    return
  }
  if (iconUrl) {
    return { url: iconUrl }
  }
  const integration =
    integrationList[integrationType as keyof typeof integrationList]
  if (integration?.iconUrl) {
    return { url: integration.iconUrl }
  }
  const icon = ICONS[integrationType as keyof typeof ICONS]
  const isCustom =
    typeof schema === "object" &&
    schema !== null &&
    "custom" in schema &&
    schema.custom
  if (isCustom || !icon) {
    return { icon: ICONS.CUSTOM }
  }
  return { icon }
}
