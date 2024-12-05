import { doInTenant } from "../context"
import { getTenantIDFromCtx } from "../tenancy"
import { buildMatcherRegex, matches } from "./matchers"
import { Header } from "../constants"
import {
  Ctx,
  EndpointMatcher,
  GetTenantIdOptions,
  TenantResolutionStrategy,
} from "@budibase/types"
import type { Next, Middleware } from "koa"

export default function (
  allowQueryStringPatterns: EndpointMatcher[],
  noTenancyPatterns: EndpointMatcher[],
  opts: { noTenancyRequired?: boolean } = { noTenancyRequired: false }
) {
  const allowQsOptions = buildMatcherRegex(allowQueryStringPatterns)
  const noTenancyOptions = buildMatcherRegex(noTenancyPatterns)

  return async function (ctx: Ctx, next: Next) {
    const allowNoTenant =
      opts.noTenancyRequired || !!matches(ctx, noTenancyOptions)
    const tenantOpts: GetTenantIdOptions = {
      allowNoTenant,
    }

    const allowQs = !!matches(ctx, allowQsOptions)
    if (!allowQs) {
      tenantOpts.excludeStrategies = [TenantResolutionStrategy.QUERY]
    }

    const tenantId = getTenantIDFromCtx(ctx, tenantOpts)
    ctx.set(Header.TENANT_ID, tenantId as string)
    return doInTenant(tenantId, next)
  } as Middleware
}
