'use strict';

module.exports.convertKeysToLowerCase = function(map) {
    var newMap = {};
    for(var key in map) {
        newMap[key.toLowerCase()] = map[key];
    }
    return newMap;
};
