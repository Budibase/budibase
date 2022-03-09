"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getFontDefinitionFromNetwork = getFontDefinitionFromNetwork;
exports.getFontDefinitionFromManifest = getFontDefinitionFromManifest;
var Log = _interopRequireWildcard(require("../build/output/log"));
var _constants = require("../shared/lib/constants");
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {
        };
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {
                    };
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
const https = require('https');
const CHROME_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36';
const IE_UA = 'Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko';
function isGoogleFont(url) {
    return url.startsWith(_constants.GOOGLE_FONT_PROVIDER);
}
function getFontForUA(url, UA) {
    return new Promise((resolve, reject)=>{
        let rawData = '';
        https.get(url, {
            headers: {
                'user-agent': UA
            }
        }, (res)=>{
            res.on('data', (chunk)=>{
                rawData += chunk;
            });
            res.on('end', ()=>{
                resolve(rawData.toString('utf8'));
            });
        }).on('error', (e)=>{
            reject(e);
        });
    });
}
async function getFontDefinitionFromNetwork(url) {
    let result = '';
    /**
   * The order of IE -> Chrome is important, other wise chrome starts loading woff1.
   * CSS cascading 🤷‍♂️.
   */ try {
        if (isGoogleFont(url)) {
            result += await getFontForUA(url, IE_UA);
        }
        result += await getFontForUA(url, CHROME_UA);
    } catch (e) {
        Log.warn(`Failed to download the stylesheet for ${url}. Skipped optimizing this font.`);
        return '';
    }
    return result;
}
function getFontDefinitionFromManifest(url, manifest) {
    var ref;
    return ((ref = manifest.find((font)=>{
        if (font && font.url === url) {
            return true;
        }
        return false;
    })) === null || ref === void 0 ? void 0 : ref.content) || '';
}

//# sourceMappingURL=font-utils.js.map