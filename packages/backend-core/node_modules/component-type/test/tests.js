var type   = require('type')
  , assert = require('component-assert');

describe('type', function(){
  it('should match objects', function(){
    function Foo(){}
    assert('object' === type({}));
    assert('object' === type(new Foo));
  });

  it('should match numbers', function(){
    assert('number' === type(12));
    assert('number' === type(1.0));
    assert('number' === type(-5));
    assert('number' === type(new Number(123)));
    assert('number' === type(Infinity));
  });

  it('should match NaN', function () {
    assert('nan' === type(NaN));
  });

  it('should match strings', function(){
    assert('string' === type("test"));
    assert('string' === type(new String('whoop')));
  });

  it('should match dates', function(){
    assert('date' === type(new Date));
  });

  it('should match booleans', function(){
    assert('boolean' === type(true));
    assert('boolean' === type(false));
    assert('boolean' === type(new Boolean(true)));
  });

  it('should match null', function(){
    assert('null' === type(null));
  });

  it('should match undefined', function(){
    assert('undefined' === type());
    assert('undefined' === type(undefined));
  });

  it('should match arrays', function(){
    assert('array' === type([]));
    assert('array' === type(new Array()));
  });

  it('should match regexps', function(){
    assert('regexp' === type(/asdf/));
    assert('regexp' === type(new RegExp('weee')));
  });

  it('should match functions', function(){
    assert('function' === type(function(){}));
  });

  it('should match arguments', function(){
    assert('arguments' === type(arguments));
  });

  it('should match elements', function(){
    assert('element' === type(document.createElement('div')));
  });

  it('should match errors', function(){
    assert('error' === type(new Error('Ups!')));
  });

  it('should match buffers', function(){
    var b = {};
    assert('object' === type(b));
    if (window.Buffer) {
      var val = new Buffer(4);
      assert('buffer' === type(val));
    }
  });
});
