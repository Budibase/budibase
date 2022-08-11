/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Riptide Cloud
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(function (should, GoogleOAuth2Strategy) {
    'use strict';
    /* jshint unused: false */
    /* jshint immed: false */
    /* jshint -W030 */
    describe('Google OAuth 2.0 Strategy', function () {
        it('should require the `verify` callback', function () {
            (function () {
                var strategy = new GoogleOAuth2Strategy({});
            }).should.throw('GoogleOAuth2Strategy requires a verify callback');
        });
        it('should be able to specify the `verify` callback without options', function () {
            (function () {
                var strategy = new GoogleOAuth2Strategy(function () {
                });
            }).should.throw('GoogleOAuth2Strategy requires a [clientId]');
        });
        it('should require the `clientId`', function () {
            (function () {
                var strategy = new GoogleOAuth2Strategy(
                    {},
                    function () {
                        return '';
                    });
            }).should.throw('GoogleOAuth2Strategy requires a [clientId]');
        });
        it('should require the `clientId` to be a String', function () {
            (function () {
                var strategy = new GoogleOAuth2Strategy(
                    {
                        clientId: 42
                    },
                    function () {
                        return '';
                    });
            }).should.throw('GoogleOAuth2Strategy expects [clientId] to be a [string] but it was a [number]');
        });
        it('should require the `clientSecret`', function () {
            (function () {
                var strategy = new GoogleOAuth2Strategy(
                    {
                        clientId: 'H2G2'
                    }, function () {
                        return '';
                    });
            }).should.throw('GoogleOAuth2Strategy requires a [clientSecret]');
        });
        it('should require the `clientSecret` to be a String', function () {
            (function () {
                var strategy = new GoogleOAuth2Strategy(
                    {
                        clientId: 'Always Carry a Towel',
                        clientSecret: 42
                    }, function () {
                        return '';
                    });
            }).should.throw('GoogleOAuth2Strategy expects [clientSecret] to be a [string] but it was a [number]');
        });
        it('should require the `callbackURL`', function () {
            (function () {
                var strategy = new GoogleOAuth2Strategy(
                    {
                        clientId: 'Toy Story 3 Was Okay',
                        clientSecret: 'Darth Vader is Luke\'s father'
                    }, function () {
                        return '';
                    });
            }).should.throw('GoogleOAuth2Strategy requires a [callbackURL]');
        });
        it('should require the `callbackURL` to be a String', function () {
            (function () {
                var strategy = new GoogleOAuth2Strategy(
                    {
                        clientId: 'Odoyle Rules!',
                        clientSecret: 'Darth Vader is Luke\'s father',
                        callbackURL: 42
                    }, function () {
                        return '';
                    });
            }).should.throw('GoogleOAuth2Strategy expects [callbackURL] to be a [string] but it was a [number]');
        });
        it('should be able to instantiate the Strategy', function () {
            (function () {
                var strategy = new GoogleOAuth2Strategy(
                    {
                        clientId: 'Odoyle Rules!',
                        clientSecret: 'Darth Vader is Luke\'s father',
                        callbackURL: 'Bow Ties are cool'
                    }, function () {
                        return '';
                    });
            }).should.not.throw();
        });
        it('should require the `accessType` to be a String', function () {
            (function () {
                var strategy = new GoogleOAuth2Strategy(
                    {
                        clientId: 'Odoyle Rules!',
                        clientSecret: 'Darth Vader is Luke\'s father',
                        callbackURL: 'Bow Ties are cool',
                        accessType: 42
                    }, function () {
                        return '';
                    });
            }).should.throw('GoogleOAuth2Strategy expects [accessType] to be a [string] but it was a [number]');
        });
        it('should be able to set the `accessType` to a String', function () {
            (function () {
                var strategy = new GoogleOAuth2Strategy(
                    {
                        clientId: 'Odoyle Rules!',
                        clientSecret: 'Darth Vader is Luke\'s father',
                        callbackURL: 'Bow Ties are cool',
                        accessType: 'I\'m a String'
                    }, function () {
                        return '';
                    });
            }).should.not.throw();
        });
        it('should require the `scope` to be a String or Array', function () {
            (function () {
                var strategy = new GoogleOAuth2Strategy(
                    {
                        clientId: 'Odoyle Rules!',
                        clientSecret: 'Darth Vader is Luke\'s father',
                        callbackURL: 'Bow Ties are cool',
                        scope: 42
                    }, function () {
                        return '';
                    });
            }).should.throw('GoogleOAuth2Strategy expects [scope] to be a [array or string] but it was a [number]');
        });
        it('should be able to set the `scope` to a String', function () {
            (function () {
                var strategy = new GoogleOAuth2Strategy(
                    {
                        clientId: 'Odoyle Rules!',
                        clientSecret: 'Darth Vader is Luke\'s father',
                        callbackURL: 'Bow Ties are cool',
                        scope: 'I\'m a String'
                    }, function () {
                        return '';
                    });
            }).should.not.throw();
        });
        it('should be able to set the `scope` to an Array', function () {
            (function () {
                var strategy = new GoogleOAuth2Strategy(
                    {
                        clientId: 'Odoyle Rules!',
                        clientSecret: 'Darth Vader is Luke\'s father',
                        callbackURL: 'Bow Ties are cool',
                        scope: [
                            'I\'m', 'an', 'Array'
                        ]
                    }, function () {
                        return '';
                    });
            }).should.not.throw();
        });
        it('should require `skipUserProfile` to be a Boolean', function () {
            (function () {
                var strategy = new GoogleOAuth2Strategy(
                    {
                        clientId: 'Odoyle Rules!',
                        clientSecret: 'Darth Vader is Luke\'s father',
                        callbackURL: 'Bow Ties are cool',
                        skipUserProfile: 'Bork Bork Bork!'
                    }, function () {
                        return '';
                    });
            }).should.throw('GoogleOAuth2Strategy expects [skipUserProfile] to be a [boolean] but it was a [string]');
        });
        it('should be able to set `skipUserProfile` to a Boolean', function () {
            (function () {
                var strategy = new GoogleOAuth2Strategy(
                    {
                        clientId: 'Odoyle Rules!',
                        clientSecret: 'Darth Vader is Luke\'s father',
                        callbackURL: 'Bow Ties are cool',
                        skipUserProfile: true
                    }, function () {
                        return '';
                    });
            }).should.not.throw();
        });
        it('should require `passReqToCallback` to be a Boolean', function () {
            (function () {
                var strategy = new GoogleOAuth2Strategy(
                    {
                        clientId: 'Odoyle Rules!',
                        clientSecret: 'Darth Vader is Luke\'s father',
                        callbackURL: 'Bow Ties are cool',
                        passReqToCallback: 'Bork Bork Bork!'
                    }, function () {
                        return '';
                    });
            }).should.throw('GoogleOAuth2Strategy expects [passReqToCallback] to be a [boolean] but it was a [string]');
        });
        it('should be able to set `passReqToCallback` to a Boolean', function () {
            (function () {
                var strategy = new GoogleOAuth2Strategy(
                    {
                        clientId: 'Odoyle Rules!',
                        clientSecret: 'Darth Vader is Luke\'s father',
                        callbackURL: 'Bow Ties are cool',
                        passReqToCallback: true
                    }, function () {
                        return '';
                    });
            }).should.not.throw();
        });
        //TODO: Add tests for the strategy itself and mocks for it also.
    });
}(require('should'), require('../index').Strategy));
