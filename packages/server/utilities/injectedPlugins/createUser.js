

module.exports = ({ masterAppInternal, instanceKey }) => async ({ user }) => {
    const { bbMaster } = masterAppInternal; 
    const masterUser = bbMaster.recordApi  
                        .getNew(`${newAppKey}/users`, "user");
    masterUser.name = user.name;
    masterUser.createdByMaster = false;
    masterUser.instance = await bbMaster.recordApi
                            .load(instanceKey);
                            
    masterUser.active = user.enabled;
    await bbMaster.recordApi.save(masterUser);
}



