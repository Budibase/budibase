var vows = require('vows'),
    assert = require('assert');

vows.describe('SHA1 Hashing').addBatch({
    'When using the SHA1 Hashing function': {
        topic: require('../lib/sha1'),
        'we get the specified digest as described in http://oauth.net/core/1.0/#sig_base_example (A.5.2)': function (sha1) {
            assert.equal (sha1.HMACSHA1( "kd94hf93k423kf44&pfkkdhi9sl3r4s00",
                           "GET&http%3A%2F%2Fphotos.example.net%2Fphotos&file%3Dvacation.jpg%26oauth_consumer_key%3Ddpf43f3p2l4k3l03%26oauth_nonce%3Dkllo9940pd9333jh%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1191242096%26oauth_token%3Dnnch734d00sl2jdk%26oauth_version%3D1.0%26size%3Doriginal"), 
                           "tR3+Ty81lMeYAr/Fid0kMTYa/WM=");
        }
    }
}).export(module);