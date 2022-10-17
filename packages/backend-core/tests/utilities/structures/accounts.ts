import { generator, uuid } from "."
import {
  Account,
  AuthType,
  CloudAccount,
  Hosting,
  PlanType,
} from "@budibase/types"
import * as db from "../../../src/db/utils"

export const paidAccount = (
  opts: { account?: Account; planType?: PlanType; dayPasses?: number } = {}
) => {
  if (!opts.account) {
    opts.account = cloudAccount()
  }
  if (!opts.planType) {
    opts.planType = PlanType.PRO
  }
  if (!opts.dayPasses) {
    opts.dayPasses = 50
  }

  const account = opts.account
  account.planType = opts.planType
  account.planTier = opts.dayPasses
  return opts.account
}

export const trialAccount = (
  opts: { account?: Account; planType?: PlanType } = {}
) => {
  const account = paidAccount(opts)

  account.isTrialing = true

  const now = new Date()
  const trialEnd = new Date(now)
  trialEnd.setDate(now.getDate() + 30)
  account.trialStartAt = now.getTime()
  account.trialStartAt = trialEnd.getTime()

  return account
}

export const cloudAccount = (): CloudAccount => {
  return {
    accountId: uuid(),
    createdAt: Date.now(),
    verified: true,
    verificationSent: true,
    tier: "",
    email: generator.email(),
    tenantId: generator.word(),
    hosting: Hosting.CLOUD,
    authType: AuthType.PASSWORD,
    password: generator.word(),
    tenantName: generator.word(),
    name: generator.name(),
    size: "10+",
    profession: "Software Engineer",
    budibaseUserId: db.generateGlobalUserID(),
  }
}
