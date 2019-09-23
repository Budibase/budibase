

export const createCoreApp = (appDefinition, user) => {
    const app = {
        datastore: null,
        crypto:null,
        publish: () => {},
        hierarchy: appDefinition.hierarchy,
        actions: appDefinition.actions
    };

    app.asUser(user);

    return app;
}