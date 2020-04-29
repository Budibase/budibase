const jwt = require("jsonwebtoken");
const CouchDB = require("../../db");
const bcrypt = require("../../utilities/bcrypt");

exports.forgotPassword = async ctx => {
};

exports.setPassword = async ctx => { };

exports.changePassword = async ctx => {
};

exports.authenticate = async ctx => {
  const { username, password } = ctx.request.body;

  if (!username) ctx.throw(400, "Username Required.");
  if (!password) ctx.throw(400, "Password Required");

  // query couch for their username
  const db = new CouchDB(ctx.params.instanceId);
  const dbUser = await db.query("by_username", { 
    include_docs: true,
    key: username
  });
  
  if (await bcrypt.compare(password, dbUser.password)) {
    const payload = { 
      userId: dbUser._id, 
      accessLevel: "", 
      instanceId: ctx.params.instanceId
    };
    const token = jwt.sign(payload, ctx.config.secret, {
      expiresIn: "1 day"
    });
    
    ctx.body = token;
  } else {
    ctx.throw(401, "Invalid credentials.");
  }
}