import {
  Account,
  AccountMetadata,
  Ctx,
  SaveAccountRequest,
  SaveAccountResponse,
} from "@budibase/types"
import * as accounts from "../../../sdk/accounts"

export const save = async (
  ctx: Ctx<SaveAccountRequest, SaveAccountResponse>
) => {
  const account = ctx.request.body as Account
  let metadata: AccountMetadata = {
    _id: accounts.metadata.formatAccountMetadataId(account.accountId),
    email: account.email,
  }

  metadata = await accounts.metadata.saveMetadata(metadata)

  ctx.body = metadata
}

export const destroy = async (ctx: Ctx<void, void>) => {
  const accountId = accounts.metadata.formatAccountMetadataId(
    ctx.params.accountId
  )
  await accounts.metadata.destroyMetadata(accountId)
  ctx.status = 204
}
