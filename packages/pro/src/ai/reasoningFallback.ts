import type { LLMProviderOptions } from "@budibase/types"

const unsupportedReasoningByModel = new WeakMap<object, true>()

function hasReasoningEffort(providerOptions?: LLMProviderOptions) {
  return Boolean(
    providerOptions?.openai?.reasoningEffort ||
      providerOptions?.azure?.reasoningEffort
  )
}

function withoutReasoningEffort(providerOptions?: LLMProviderOptions) {
  if (!providerOptions) {
    return providerOptions
  }

  const next = { ...providerOptions }
  if (next.openai) {
    const openai = { ...next.openai }
    delete openai.reasoningEffort
    next.openai = openai
  }
  if (next.azure) {
    const azure = { ...next.azure }
    delete azure.reasoningEffort
    next.azure = azure
  }
  return next
}

function isUnsupportedReasoningError(err: unknown) {
  const error = err as any
  const status =
    error?.statusCode ||
    error?.status ||
    error?.cause?.status ||
    error?.response?.status

  if (status && status !== 400) {
    return false
  }

  const message = [
    error?.message,
    error?.cause?.message,
    error?.responseBody,
    error?.response?.body,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  return (
    message.includes("reasoning") &&
    (message.includes("unsupported") ||
      message.includes("unknown") ||
      message.includes("invalid"))
  )
}

export async function runWithReasoningEffortFallback<T>({
  model,
  providerOptions,
  run,
}: {
  model: object
  providerOptions: LLMProviderOptions | undefined
  run: (opts?: LLMProviderOptions) => Promise<T>
}): Promise<T> {
  if (!hasReasoningEffort(providerOptions)) {
    return run(providerOptions)
  }

  if (unsupportedReasoningByModel.has(model)) {
    return run(withoutReasoningEffort(providerOptions))
  }

  try {
    return await run(providerOptions)
  } catch (err) {
    if (!isUnsupportedReasoningError(err)) {
      throw err
    }

    unsupportedReasoningByModel.set(model, true)
    return run(withoutReasoningEffort(providerOptions))
  }
}
