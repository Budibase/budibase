module.exports = {
    upgrade: true,
    reject: [
        // API changes break existing tests
        'proxy'
    ]
};
