

module.exports.timeout = ms => 
    new Promise(resolve => setTimeout(resolve, ms));

module.exports.sleep = async (ms, fn) => {
    await timeout(ms);
    return await fn(...args);
}