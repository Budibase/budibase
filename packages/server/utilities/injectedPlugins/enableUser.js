
module.exports = ({ masterAppInternal, app }) => async ({ username }) => {
    await masterAppInternal.enableUser(
        app, username
    );
}