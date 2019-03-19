
export const budibaseRouting = (options) => {

    return async (ctx, next) => {

        ctx.request.path

    };

};

/* api Routes (all /api/..)

POST executeAction/<name> {}
POST authenticate {}
POST authenticateTemporaryAccess {}
POST createUser {}
POST enabledUser {}
POST disableUser {}
GET users 
GET accessLevels
POST accessLevels {}
POST changeMyPassword {}
POST setPasswordFromTemporaryCode {}
POST listItems/index/key {}
POST aggregates/index/key {}
POST record/key/to/rec {}
GET record/key/to/rec
DELETE record/key/to/rec
POST appHeirarchy {}
POST actionsAndTriggers {}
GET appDefinition

*/