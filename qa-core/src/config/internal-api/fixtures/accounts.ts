import { Account } from "@budibase/types";
import generator from "../../generator";

export const generateAccount = (): Account => {
    const randomGuid = generator.guid();
    return {
        email: `qa+${randomGuid}@budibase.com`,
        hosting: "cloud",
        name: `qa+${randomGuid}@budibase.com`,
        password: `${randomGuid}`,
        profession: "software_engineer",
        size: "10+",
        tenantId: `${randomGuid}`,
        tenantName: `${randomGuid}`,
    }
}

