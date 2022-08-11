import { getAppDB } from "./src/context";
import { getDevAppDB } from "./src/context";
import { getProdAppDB } from "./src/context";
import { getAppId } from "./src/context";
import { updateAppId } from "./src/context";
import { doInAppContext } from "./src/context";
import { doInTenant } from "./src/context";
import identity = require("./src/context/identity");
export { getAppDB, getDevAppDB, getProdAppDB, getAppId, updateAppId, doInAppContext, doInTenant, identity };
