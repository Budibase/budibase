const {getTemplateApi} = require("@budibase/core");
const templateApi = getTemplateApi({});
module.exports = (appDefinition) => {
    appDefinition.hierarchy = templateApi.constructHierarchy(appDefinition.hierarchy);
    return appDefinition;
}