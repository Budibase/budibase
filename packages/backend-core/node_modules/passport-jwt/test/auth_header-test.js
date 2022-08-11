var auth_hdr = require('../lib/auth_header')


describe('Parsing Auth Header field-value', function() {

    it('Should handle single space separated values', function() {
        var res = auth_hdr.parse("SCHEME VALUE");
        expect(res).to.deep.equal({scheme: "SCHEME", value: "VALUE"});
    });


    it('Should handle CRLF separator', function() {
        var res = auth_hdr.parse("SCHEME\nVALUE");
        expect(res).to.deep.equal({scheme: "SCHEME", value: "VALUE"});
    });


    it('Should handle malformed authentication headers with no scheme', function() {
        var res = auth_hdr.parse("malformed");
        expect(res).to.not.be.ok;
    });


    it('Should return null when the auth header is not a string', function() {
        var res = auth_hdr.parse({});
        expect(res).to.be.null;
    });
});
