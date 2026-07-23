import type {
  Ctx,
  FunctionQueryBrokerRequest,
  FunctionQueryBrokerResponse,
} from "@budibase/types"
import { FunctionErrorCode } from "@budibase/types"
import { executeFunctionQuery, FunctionExecutionError } from "../../functions"

interface FunctionQueryBrokerErrorResponse {
  error: {
    code: FunctionErrorCode
    message: string
  }
}

export const execute = async (
  ctx: Ctx<
    FunctionQueryBrokerRequest,
    FunctionQueryBrokerResponse | FunctionQueryBrokerErrorResponse
  >
) => {
  try {
    ctx.body = {
      data: await executeFunctionQuery(ctx.request.body, ctx.appId),
    }
  } catch (error) {
    const safeError =
      error instanceof FunctionExecutionError
        ? error
        : new FunctionExecutionError(FunctionErrorCode.FUNCTION_RUNTIME_ERROR)
    if (safeError.code === FunctionErrorCode.FUNCTION_QUERY_LIMIT) {
      ctx.status = 429
    } else if (safeError.code === FunctionErrorCode.FUNCTION_QUERY_DENIED) {
      ctx.status = 403
    } else {
      ctx.status = 400
    }
    ctx.body = {
      error: {
        code: safeError.code,
        message: safeError.message,
      },
    }
  }
}
