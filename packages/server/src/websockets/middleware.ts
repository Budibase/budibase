import { Socket } from "socket.io"
import Cookies from "cookies"
import http from "http"
import Koa from "koa"
import { Header } from "@budibase/backend-core"

/**
 * Constructs a fake Koa context to use for manually running middlewares in
 * sockets
 * @param app the Koa app
 * @param socket the socket.io socket instance
 * @param options additional metadata to populate the context with
 */
export const createContext = (
  app: Koa,
  socket: Socket,
  options?: WebsocketContextOptions
) => {
  const res = new http.ServerResponse(socket.request)
  const context: WebsocketContext = {
    ...app.createContext(socket.request, res),

    // Additional overrides needed to make our middlewares work with this
    // fake koa context
    resourceId: options?.resourceId,
    path: "/fake",
    request: {
      url: "/fake",
      headers: {
        [Header.APP_ID]: options?.appId,
      },
    },
    cookies: new Cookies(socket.request, res),
    get: (field: string) => socket.request.headers?.[field] as string,
    throw: (...params: any[]) => {
      // Throw has a bunch of different signatures, so we'll just stringify
      // whatever params we get given
      throw new Error(
        ...(params?.join(" ") || "Unknown error in socket middleware")
      )
    },

    // Needed for koa-useragent middleware
    headers: socket.request.headers,
    header: socket.request.headers,
  }
  return context
}

/**
 * Runs a list of middlewares, nesting each callback inside each other to mimic
 * how the real middlewares run and ensuring that app and tenant contexts work
 * as expected
 * @param ctx the Koa context
 * @param middlewares the array of middlewares to run
 * @param callback a final callback for when all middlewares are completed
 */
export const runMiddlewares = async (
  ctx: any,
  middlewares: any[],
  callback: () => Promise<void>
) => {
  if (!middlewares[0]) {
    await callback()
  } else {
    await middlewares[0](ctx, async () => {
      await runMiddlewares(ctx, middlewares.slice(1), callback)
    })
  }
}

export interface WebsocketContext extends Omit<Koa.Context, "request"> {
  request: {
    url: string
    headers: {
      [key: string]: string | undefined
    }
  }
  cookies: Cookies
}

export interface WebsocketContextOptions {
  appId?: string
  resourceId?: string
}
