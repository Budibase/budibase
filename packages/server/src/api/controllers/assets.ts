// this is a public endpoint with no middlewares
export const serveBuilderAssets = async function (ctx: Ctx<void, void>) {
  const builderPath = join(TOP_LEVEL_PATH, "builder")
  await send(ctx, ctx.file, { root: builderPath })
}
