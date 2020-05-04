const jwt = require("jsonwebtoken");

module.exports = async (ctx, next) => {
  if (!ctx.headers.authorization) {
    ctx.isAuthenticated = false
    await next();
    return;
  };
  // if (!ctx.headers.authorization) ctx.throw(403, "No token provided");

  const [_, token] = ctx.headers.authorization.split(" ");

  try {
    ctx.request.jwtPayload = jwt.verify(token, ctx.config.jwtSecret);
    ctx.isAuthenticated = true;
  } catch (err) {
    ctx.throw(err.status || 403, err.text);
  }

  await next();
};