const getMasterAppInternal = require("../utilities/masterAppInternal");

module.exports = async (config, masterIsCreated) => {
    const context = { config };

    if(!masterIsCreated) return context;
    
    const master = await getMasterAppInternal(context);
    context.master = master;
    return context;
};