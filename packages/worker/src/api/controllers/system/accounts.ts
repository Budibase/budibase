import { Account, AccountMetadata } from "@budibase/types"
import { accounts } from "../../../sdk"

export const save = async (ctx: any) => {
  const account = ctx.request.body as Account
  let metadata: AccountMetadata = {
    _id: accounts.formatAccountMetadataId(account.accountId),
    email: account.email,
  }

  metadata = await accounts.saveMetadata(metadata)

  ctx.body = metadata
  ctx.status = 200
}

export const destroy = async (ctx: any) => {
  const accountId = accounts.formatAccountMetadataId(ctx.params.accountId)
  await accounts.destroyMetadata(accountId)
  ctx.status = 204
}
