import { Account, AccountMetadata } from "@budibase/types"
import sdk from "../../../sdk"

export const save = async (ctx: any) => {
  const account = ctx.request.body as Account
  let metadata: AccountMetadata = {
    _id: sdk.accounts.formatAccountMetadataId(account.accountId),
    email: account.email,
  }

  metadata = await sdk.accounts.saveMetadata(metadata)

  ctx.body = metadata
  ctx.status = 200
}

export const destroy = async (ctx: any) => {
  const accountId = sdk.accounts.formatAccountMetadataId(ctx.params.accountId)
  await sdk.accounts.destroyMetadata(accountId)
  ctx.status = 204
}
