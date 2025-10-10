const fs = require("fs");
const path = require("path");

const demo = [
  { _id: "ws-1", name: "Personal Workspace", limits: { maxUsers: 5, maxRows: 100 } },
  { _id: "ws-2", name: "Team Workspace", limits: { maxUsers: 50, maxRows: 10000 } },
  { _id: "ws-3", name: "Enterprise", limits: { maxUsers: 500, maxRows: 100000 } },
];

async function run() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.log("No MONGODB_URI provided. Writing demo JSON to ./workspaces-demo.json");
    fs.writeFileSync(path.resolve("./workspaces-demo.json"), JSON.stringify(demo, null, 2), "utf8");
    console.log("Done. You can POST this JSON to /api/workspaces/_setStore for demo.");
    return;
  }

  // If you have Mongoose, adapt the following block to insert into your DB.
  console.log("MONGODB_URI present but script is not configured for your ORM. See comments to adapt.");
}

run().catch((err) => { console.error(err); process.exit(1); });
