import { utils } from "@budibase/backend-core"

const { getDispatcher } = utils

/**
 * A proxy-aware fetch function that respects global-agent environment variables.
 * Use this instead of the native fetch when making external HTTP requests that
 * need to go through a proxy.
 *
 * @param input - The URL or Request object
 * @param init - Optional fetch init options
 * @param options - Optional configuration for TLS verification
 * @returns Promise<Response>
 */
export async function proxyFetch(
  input: string | URL | Request,
  init?: RequestInit,
  options?: { rejectUnauthorized?: boolean }
): Promise<Response> {
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.href
        : input.url

  const dispatcher = getDispatcher({
    rejectUnauthorized: options?.rejectUnauthorized,
    url,
  })

  // @ts-expect-error - dispatcher is a valid option for fetch in Node.js
  return fetch(input, { ...init, dispatcher })
}
