const { getAppContext } = require("../../common");
const app = require("@budibase/server/app");

module.exports = ({config}) => {
    getAppContext(config).then(context => {
        app(context)
    });    
}

