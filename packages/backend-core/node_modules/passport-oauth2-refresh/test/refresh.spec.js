'use strict';

require('mocha');

const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const AuthTokenRefresh = require('../lib/refresh.js');

chai.use(require('sinon-chai'));

// Dummy OAuth2 object
function OAuth2(
  clientId,
  clientSecret,
  baseSite,
  authorizeUrl,
  accessTokenUrl,
) {
  this._accessTokenUrl = accessTokenUrl;
}

// Add dummy method
OAuth2.prototype.getOAuthAccessToken = new Function();

// Makes it easy to invocate in the specs
const newOAuth2 = function (accessTokenUrl) {
  return new OAuth2(null, null, null, null, accessTokenUrl);
};

describe('Auth token refresh', function () {
  beforeEach(function () {
    AuthTokenRefresh._strategies = {};
  });

  describe('use', function () {
    it('should add a strategy with an explicitly defined name', function () {
      const strategy = {
        name: 'internal_name',
        _oauth2: newOAuth2(),
      };

      AuthTokenRefresh.use('explicit_name', strategy);

      expect(AuthTokenRefresh._strategies.explicit_name.strategy).to.equal(
        strategy,
      );
      expect(AuthTokenRefresh._strategies.strategy).to.be.undefined;
    });

    it('should add a strategy without an explicitly defined name', function () {
      const strategy = {
        name: 'internal_name',
        _oauth2: newOAuth2(),
      };

      AuthTokenRefresh.use(strategy);

      expect(AuthTokenRefresh._strategies.internal_name.strategy).to.equal(
        strategy,
      );
    });

    it('should add a strategy with a refreshURL', function () {
      const strategy = {
        name: 'test_strategy',
        _refreshURL: 'refreshURL',
        _oauth2: newOAuth2('accessTokenUrl'),
      };

      AuthTokenRefresh.use(strategy);
      expect(AuthTokenRefresh._strategies.test_strategy.strategy).to.equal(
        strategy,
      );
      expect(
        AuthTokenRefresh._strategies.test_strategy.refreshOAuth2
          ._accessTokenUrl,
      ).to.equal('refreshURL');
    });

    it('should add a strategy without a refreshURL', function () {
      const strategy = {
        name: 'test_strategy',
        _oauth2: newOAuth2('accessTokenUrl'),
      };

      AuthTokenRefresh.use(strategy);
      expect(AuthTokenRefresh._strategies.test_strategy.strategy).to.equal(
        strategy,
      );
      expect(
        AuthTokenRefresh._strategies.test_strategy.refreshOAuth2
          ._accessTokenUrl,
      ).to.equal('accessTokenUrl');
    });

    it("should create a new oauth2 object with the same prototype as the strategy's _oauth2 object", function () {
      const strategyOAuth2 = newOAuth2();
      const strategy = {
        name: 'test_strategy',
        _oauth2: strategyOAuth2,
      };

      AuthTokenRefresh.use(strategy);
      expect(
        AuthTokenRefresh._strategies.test_strategy.refreshOAuth2,
      ).to.not.equal(strategyOAuth2);
      expect(
        AuthTokenRefresh._strategies.test_strategy.refreshOAuth2,
      ).to.be.instanceof(OAuth2);
    });

    it('should set the oauth2 adapter with the options object', function () {
      const strategyOAuth2 = newOAuth2();
      const customOAuth2 = newOAuth2();
      const strategy = {
        name: 'test_strategy',
        _oauth2: strategyOAuth2,
      };
      const setRefreshOAuth2 = sinon.fake.returns(customOAuth2);

      AuthTokenRefresh.use(strategy, {
        setRefreshOAuth2,
      });

      expect(setRefreshOAuth2).to.have.been.calledWith({
        strategyOAuth2,
        refreshOAuth2: sinon.match.instanceOf(OAuth2),
      });
      expect(AuthTokenRefresh._strategies.test_strategy.refreshOAuth2).to.equal(
        customOAuth2,
      );
    });

    it('should throw if the strategy does not supply an oauth2 instance and the setRefreshOAuth2 function is not specified', function () {
      const strategy = {
        name: 'test_strategy',
      };

      const fn = function () {
        AuthTokenRefresh.use(strategy);
      };

      expect(fn).to.throw(
        Error,
        'The OAuth2 adapter used to refresh the token is not configured correctly. Use the setRefreshOAuth2 option to return a OAuth 2.0 adapter.',
      );
    });

    it('should throw if the strategy does not supply an oauth2 instance and the setRefreshOAuth2 function does not return an oauth2 adapter', function () {
      const strategy = {
        name: 'test_strategy',
      };
      const modifyOAuth2 = sinon.fake.returns(undefined);

      const fn = function () {
        AuthTokenRefresh.use(strategy, {
          modifyOAuth2,
        });
      };

      expect(fn).to.throw(
        Error,
        'The OAuth2 adapter used to refresh the token is not configured correctly. Use the setRefreshOAuth2 option to return a OAuth 2.0 adapter.',
      );
    });

    it('should not add a null strategy', function () {
      const strategy = null;
      const fn = function () {
        AuthTokenRefresh.use(strategy);
      };

      expect(fn).to.throw(Error, 'Cannot register: strategy is null');
    });

    it('should not add a strategy with no name', function () {
      const strategy = {
        name: '',
        _oauth2: newOAuth2(),
      };

      const fn = function () {
        AuthTokenRefresh.use(strategy);
      };

      expect(fn).to.throw(
        Error,
        'Cannot register: name must be specified, or strategy must include name',
      );
    });

    it('should use the default getOAuthAccessToken function if not overwritten by strategy', function () {
      const strategy = {
        name: 'test_strategy',
        _oauth2: newOAuth2(),
      };

      AuthTokenRefresh.use(strategy);
      expect(
        AuthTokenRefresh._strategies.test_strategy.refreshOAuth2
          .getOAuthAccessToken,
      ).to.equal(OAuth2.prototype.getOAuthAccessToken);
    });

    it('should use the overwritten getOAuthAccessToken function if overwritten by strategy', function () {
      const strategy = {
        name: 'test_strategy',
        _oauth2: newOAuth2(),
      };

      strategy._oauth2.getOAuthAccessToken = new Function();

      AuthTokenRefresh.use(strategy);
      expect(
        AuthTokenRefresh._strategies.test_strategy.refreshOAuth2
          .getOAuthAccessToken,
      ).to.equal(strategy._oauth2.getOAuthAccessToken);
      expect(
        AuthTokenRefresh._strategies.test_strategy.refreshOAuth2
          .getOAuthAccessToken,
      ).not.equal(OAuth2.prototype.getOAuthAccessToken);
    });
  });

  describe('has', function () {
    it('should return true if a strategy has been added', function () {
      const strategy = {
        name: 'test_strategy',
        _oauth2: newOAuth2(),
      };

      AuthTokenRefresh.use(strategy);
      expect(AuthTokenRefresh.has('test_strategy')).to.be.true;
    });

    it('should return false if a strategy has not been added', function () {
      expect(AuthTokenRefresh.has('test_strategy')).to.be.false;
    });
  });

  describe('request new access token', function () {
    it('should refresh an access token', function () {
      const getOAuthAccessTokenSpy = sinon.spy();
      const done = sinon.spy();

      AuthTokenRefresh._strategies = {
        test_strategy: {
          refreshOAuth2: {
            getOAuthAccessToken: getOAuthAccessTokenSpy,
          },
        },
      };

      AuthTokenRefresh.requestNewAccessToken(
        'test_strategy',
        'refresh_token',
        done,
      );

      expect(getOAuthAccessTokenSpy).to.have.been.calledWith(
        'refresh_token',
        { grant_type: 'refresh_token' },
        done,
      );
    });

    it('should refresh a new access token with extra params', function () {
      const getOAuthAccessTokenSpy = sinon.spy();
      const done = sinon.spy();

      AuthTokenRefresh._strategies = {
        test_strategy: {
          refreshOAuth2: {
            getOAuthAccessToken: getOAuthAccessTokenSpy,
          },
        },
      };

      AuthTokenRefresh.requestNewAccessToken(
        'test_strategy',
        'refresh_token',
        { some: 'extra_param' },
        done,
      );

      expect(getOAuthAccessTokenSpy).to.have.been.calledWith(
        'refresh_token',
        { grant_type: 'refresh_token', some: 'extra_param' },
        done,
      );
    });

    it('should not refresh if the strategy was not previously registered', function () {
      const done = sinon.spy();
      const expected = sinon.match
        .instanceOf(Error)
        .and(
          sinon.match.has(
            'message',
            'Strategy was not registered to refresh a token',
          ),
        );

      AuthTokenRefresh.requestNewAccessToken(
        'test_strategy',
        'refresh_token',
        done,
      );

      expect(done).to.have.been.calledWith(expected);
    });
  });
});
