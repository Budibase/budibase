const send = require("koa-send");
const { resolve } = require("path")

// either serve the builder or serve the actual app index.html
const builderPath = resolve(process.cwd(), "builder")

exports.serveBuilder = async function(ctx) {
  console.log(ctx.file);
  await send(ctx, ctx.file, { root: builderPath })
}

exports.serveApp = async function(ctx) {
  // resolve unauthenticated page if so
  await send(ctx, "/index.html", { root: ctx.publicPath })
  // resolve main page if user authenticated
}

exports.serveComponentLibrary = async function(ctx) {
  await send(ctx, "/index.html", { root: builderPath })
}