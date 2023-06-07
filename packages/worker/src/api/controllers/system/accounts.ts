import { Account, AccountMetadata, Ctx } from "@budibase/types"
import * as accounts from "../../../sdk/accounts"

export const save = async (ctx: Ctx<Account, AccountMetadata>) => {
  const account = ctx.request.body as Account
  let metadata: AccountMetadata = {
    _id: accounts.metadata.formatAccountMetadataId(account.accountId),
    email: account.email,
  }

  metadata = await accounts.metadata.saveMetadata(metadata)

  ctx.body = metadata
  ctx.status = 200
}

export const destroy = async (ctx: any) => {
  const accountId = accounts.metadata.formatAccountMetadataId(
    ctx.params.accountId
  )
  await accounts.metadata.destroyMetadata(accountId)
  ctx.status = 204
}
