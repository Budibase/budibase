const jwt = require("jsonwebtoken");
const CouchDB = require("../../db");
const bcrypt = require("../../utilities/bcrypt");

exports.authenticate = async ctx => {
  const { username, password } = ctx.request.body;

  if (!username) ctx.throw(400, "Username Required.");
  if (!password) ctx.throw(400, "Password Required");

  // TODO: Don't use this. It can't be relied on
  const referer = ctx.request.headers.referer.split("/");
  const appId = referer[3];

  // find the instance that the user is associated with 
  const db = new CouchDB(`client-${process.env.CLIENT_ID}`);
  const app = await db.get(appId);
  const instanceId = app.userInstanceMap[username];

  if (!instanceId) ctx.throw(500, "User is not associated with an instance of app", appId)

  // Check the user exists in the instance DB by username
  const instanceDb = new CouchDB(instanceId);
  const { rows } = await instanceDb.query("database/by_username", { 
    include_docs: true,
    username
  });

  if (rows.length === 0) ctx.throw(500, `User does not exist.`);

  const dbUser = rows[0].doc;

  // authenticate
  if (await bcrypt.compare(password, dbUser.password)) {
    const payload = { 
      userId: dbUser._id, 
      accessLevel: "", 
      instanceId: instanceId
    };


    const token = jwt.sign(payload, ctx.config.jwtSecret, {
      expiresIn: "1 day"
    });
    
    ctx.cookies.set('budibase:token', token);

    ctx.body = {
      token,
      ...dbUser
    };
  } else {
    ctx.throw(401, "Invalid credentials.");
  }
}