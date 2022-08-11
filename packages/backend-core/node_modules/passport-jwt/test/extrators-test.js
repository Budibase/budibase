var extract_jwt = require('../lib/extract_jwt'),
    Request = require('./mock_request');

describe('Token extractor', function() {

    describe('fromHeader', function() {

        var extractor = extract_jwt.fromHeader('test_header');

        it('should return null no when token is present', function() {
            var req = new Request();

            var token = extractor(req);

            expect(token).to.be.null; 
        });


        it('should return the value from the specified header', function() {
            var req = new Request();
            req.headers['test_header'] = 'abcd123'

            var token = extractor(req)

            expect(token).to.equal('abcd123'); 
        });
    });


    describe('fromBodyField', function() {

        var extractor = extract_jwt.fromBodyField('test_field');

        it('should return null when no body is present', function() {
            var req = new Request();
            
            var token = extractor(req);

            expect(token).to.be.null;
        });


        it('should return null when the specified body field is not present', function() {
            var req = new Request();
            req.body = {};

            var token = extractor(req);

            expect(token).to.be.null;
        });


        it('should return the value from the specified body field', function() {
            var req = new Request();
            req.body = {};
            req.body.test_field = 'abcd123';

            var token = extractor(req);

            expect(token).to.equal('abcd123');
        });


        it('should work properly with querystring', function() {
            var req = new Request();
            const querystring = require('querystring');
            req.body = querystring.parse('test_field=abcd123')

            var token = extractor(req);

            expect(token).to.equal('abcd123')
        });
    });


    describe('fromUrlQueryParameter', function() {

        var extractor = extract_jwt.fromUrlQueryParameter('test_param');


        it('should return null when the specified paramter is not present', function() {
            var req = new Request();

            var token = extractor(req);

            expect(token).to.be.null;
        });


        it('should return the value from the specified parameter', function() {
            var req = new Request();
            req.url += '?test_param=abcd123';

            var token = extractor(req);

            expect(token).to.equal('abcd123');
        });
    });


    describe('fromAuthHeaderWithScheme', function() {

        var extractor = extract_jwt.fromAuthHeaderWithScheme('TEST_SCHEME');

        it('should return null when no auth header is present', function() {
            var req = new Request();

            var token = extractor(req);

            expect(token).to.be.null;
        });


        it('should return null when the auth header is present but the auth scheme doesnt match', function() {
            var req = new Request()
            req.headers['authorization'] = "NOT_TEST_SCHEME abcd123";

            var token = extractor(req);

            expect(token).to.be.null;
        });


        it('should return the value from the authorization header with specified auth scheme', function() {
            var req = new Request()
            req.headers['authorization'] = "TEST_SCHEME abcd123";

            var token = extractor(req);

            expect(token).to.equal('abcd123');
        });


        it('should perform a case-insensivite string comparison', function () {
            var req = new Request()
            req.headers['authorization'] = 'test_scheme abcd123';

            var token = extractor(req);

            expect(token).to.equal('abcd123');
        });
    });


    describe('fromAuthHeader', function() {
        
        var extractor = extract_jwt.fromAuthHeaderAsBearerToken();

        it('should return the value from the authorization header with default JWT auth scheme', function() {
            var req = new Request()
            req.headers['authorization'] = "bearer abcd123";

            var token = extractor(req);

            expect(token).to.equal('abcd123');
        });


    });
    
    describe('fromExtractors', function() {

        it('should raise a type error when the extractor is constructed with a non-array argument', function() {
            this_should_throw = function() {
                var extractor = extract_jwt.fromExtractors({})
            }

            expect(this_should_throw).to.throw(TypeError)
        });


        var extractor = extract_jwt.fromExtractors([extract_jwt.fromAuthHeaderAsBearerToken(), extract_jwt.fromHeader('authorization')]);

        it('should return null when no extractor extracts token', function() {
            var req = new Request();

            var token = extractor(req);

            expect(token).to.be.null;
        });


        it('should return token found by least extractor', function() {
            var req = new Request()
            req.headers['authorization'] = "abcd123";

            var token = extractor(req);

            expect(token).to.equal('abcd123');
        });


        it('should return token found by first extractor', function() {
            var req = new Request()
            req.headers['authorization'] = "bearer abcd123";

            var token = extractor(req);

            expect(token).to.equal('abcd123');
        });

    });


    describe('versionOneCompatibility', function () {

        describe('default behavior', function() {

                var extractor = extract_jwt.versionOneCompatibility({});

                it('should return the token in the default "JWT" auth header', function () {
                    var req = new Request();
                    req.headers['authorization'] = "JWT abcd123";

                    var token = extractor(req);

                    expect(token).to.equal('abcd123');
                });


                it('should return the token in the default "auth_token" body field', function () {
                    var req = new Request();
                    req.body = {};
                    req.body['auth_token'] = 'xyzabcd';

                    var token = extractor(req);

                    expect(token).to.equal('xyzabcd');
                });


                it('should return then token in the default "auth_token" query parameter', function () {
                    var req = new Request();
                    req.url += '?auth_token=abcd123';

                    var token = extractor(req);

                    expect(token).to.equal('abcd123');
                });
        });


        describe('user supplied parameters', function() {

            it('should return the token in an auth header with a user specified auth scheme', function() {
                var opts = { authScheme: 'MY_CUSTOM_AUTH_SCHEME' };
                var extractor = extract_jwt.versionOneCompatibility(opts);
                var req = new Request();
                req.headers['authorization'] = 'MY_CUSTOM_AUTH_SCHEME deadbeef';

                var token = extractor(req);

                expect(token).to.equal('deadbeef');
            });


            it('should return the token in a user supplied body field', function () {
                var opts = { tokenBodyField: 'CUSTOM_BODY_FIELD' };
                var extractor = extract_jwt.versionOneCompatibility(opts);
                var req = new Request();
                req.body = {};
                req.body['CUSTOM_BODY_FIELD'] = 'badbeef';

                var token = extractor(req);

                expect(token).to.equal('badbeef');
            });


            it('should return the token in a user specified query parameter', function () {
                var opts = { tokenQueryParameterName: 'CustomQueryParam' };
                var extractor = extract_jwt.versionOneCompatibility(opts);
                var req = new Request();
                req.url += '?CustomQueryParam=deadbeef';

                var token = extractor(req);

                expect(token).to.equal('deadbeef');
            });

        });


    });

});

