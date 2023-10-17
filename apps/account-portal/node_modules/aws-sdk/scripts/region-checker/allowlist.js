var allowlist = {
    '/config.js': [
        24,
        25,
        85,
        86,
        201,
        255,
        256
    ],
    '/credentials/cognito_identity_credentials.js': [
        78,
        79,
        109
    ],
    '/credentials/shared_ini_file_credentials.js': [
        4,
    ],
    '/http.js': [
        5
    ],
    '/rds/signer.js': [
        43,
        44,
        97,
        99,
        110,
        112
    ],
    '/region_config.js': [
        127
    ],
    '/request.js': [
        318,
        319
    ],
    '/services/s3.js': [
        87,
        88,
        252,
        254,
        267,
        273,
        629,
        631,
        750,
        761,
        762,
        763,
        768
    ]
};

module.exports = {
    allowlist: allowlist
};
