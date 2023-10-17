'use strict';
var test = require('tape');
var copyfiles = require('../');
var rimraf = require('rimraf');
var fs = require('fs');
var _mkdirp = require('mkdirp');
var cp = require('child_process');
var glob = require('glob');
const mkdirp = (path, cb) => {
  _mkdirp(path).then(()=>{
    cb();
  }, cb);
}
function after(t) {
  rimraf('output', function (err) {
    t.error(err, 'rm out');
    rimraf('input', function (err) {
      t.error(err, 'rm input');
      t.end();
    });
  });
}
function before(t) {
  mkdirp('input/other', function (err) {
    t.error(err, 'rm input');
    t.end();
  });
}

test('normal', function (t) {
  t.test('setup', before);
  t.test('copy stuff', function (t) {
    fs.writeFileSync('input/a.txt', 'a');
    fs.writeFileSync('input/b.txt', 'b');
    fs.writeFileSync('input/c.js', 'c');
    copyfiles(['input/*.txt', 'output'], function (err) {
      t.error(err, 'copyfiles');
      fs.readdir('output/input', function (err, files) {
        t.error(err, 'readdir');
        t.deepEquals(files, ['a.txt', 'b.txt'], 'correct number of things');
        t.end();
      });
    });
  });
  t.test('teardown', after);
});
test('modes', function (t) {
  t.test('setup', before);
  t.test('copy stuff', function (t) {
    fs.writeFileSync('input/a.txt', 'a', {
      mode: 33261
    });
    fs.writeFileSync('input/b.txt', 'b');
    fs.writeFileSync('input/c.js', 'c');
    copyfiles(['input/*.txt', 'output'], function (err) {
      t.error(err, 'copyfiles');
      fs.readdir('output/input', function (err, files) {
        t.error(err, 'readdir');
        t.deepEquals(files, ['a.txt', 'b.txt'], 'correct number of things');
        t.equals(fs.statSync('output/input/a.txt').mode, 33261, 'correct mode')
        t.end();
      });
    });
  });
  t.test('teardown', after);
});
test('exclude', function (t) {
  t.test('setup', before);
  t.test('copy stuff', function (t) {
    fs.writeFileSync('input/a.txt', 'a');
    fs.writeFileSync('input/b.txt', 'b');
    fs.writeFileSync('input/c.js.txt', 'c');
    fs.writeFileSync('input/d.ps.txt', 'd');
    copyfiles( ['input/*.txt', 'output'], {
      exclude: ['**/*.js.txt', '**/*.ps.txt']
    }, function (err) {
      t.error(err, 'copyfiles');
      fs.readdir('output/input', function (err, files) {
        t.error(err, 'readdir');
        t.deepEquals(files, ['a.txt', 'b.txt'], 'correct number of things');
        t.end();
      });
    });
  });
  t.test('teardown', after);
});
test('exclude cl', function (t) {
  t.test('setup', before);
  t.test('copy stuff', function (t) {
    fs.writeFileSync('input/a.txt', 'a');
    fs.writeFileSync('input/b.txt', 'b');
    fs.writeFileSync('input/c.js.txt', 'c');
    fs.writeFileSync('input/d.ps.txt', 'd');
    cp.spawnSync('./copyfiles', ['-e', '**/*.js.txt', '-e', '**/*.ps.txt', 'input/*.txt', 'output']);
    fs.readdir('output/input', function (err, files) {
      t.error(err, 'readdir');
      t.deepEquals(files, ['a.txt', 'b.txt'], 'correct number of things');
      t.end();
    });
  });
  t.test('teardown', after);
});
test('all', function (t) {
  t.test('setup', before);
  t.test('copy stuff', function (t) {
    fs.writeFileSync('input/a.txt', 'a');
    fs.writeFileSync('input/b.txt', 'b');
    fs.writeFileSync('input/.c.txt', 'c');
    copyfiles( ['input/*.txt', 'output'], {
      all: true
    }, function (err) {
      t.error(err, 'copyfiles');
      fs.readdir('output/input', function (err, files) {
        t.error(err, 'readdir');
        t.deepEquals(files, ['.c.txt', 'a.txt', 'b.txt'], 'correct number of things');
        t.end();
      });
    });
  });
  t.test('teardown', after);
});
test('all from cl', function (t) {
  t.test('setup', before);
  t.test('copy stuff', function (t) {
    fs.writeFileSync('input/a.txt', 'a');
    fs.writeFileSync('input/b.txt', 'b');
    fs.writeFileSync('input/.c.txt', 'c');
    cp.spawnSync('./copyfiles', ['-a', 'input/*.txt', 'output']);
    fs.readdir('output/input', function (err, files) {
      t.error(err, 'readdir');
      t.deepEquals(files, ['.c.txt', 'a.txt', 'b.txt'], 'correct number of things');
      t.end();
    });
  });
  t.test('teardown', after);
});
test('error on nothing coppied', function (t) {
  t.test('setup', before);
  t.test('copy stuff', function (t) {
    fs.writeFileSync('input/.c.txt', 'c');
    var out = cp.spawnSync('./copyfiles', ['-E', 'input/*.txt', 'output']);
    t.ok(out.status, 'should error');
    t.end();
  });
  t.test('teardown', after);
});
test('all from cl 2', function (t) {
  t.test('setup', before);
  t.test('copy stuff', function (t) {
    fs.writeFileSync('input/a.txt', 'a');
    fs.writeFileSync('input/b.txt', 'b');
    fs.writeFileSync('input/.c.txt', 'c');
    cp.spawnSync('./copyfiles', ['--all', 'input/*.txt', 'output']);
    fs.readdir('output/input', function (err, files) {
      t.error(err, 'readdir');
      t.deepEquals(files, ['.c.txt', 'a.txt', 'b.txt'], 'correct number of things');
      t.end();
    });
  });
  t.test('teardown', after);
});
test('soft', function (t) {
  t.test('setup', before);
  t.test('copy stuff', function (t) {
    mkdirp('output/input/other', function(){
      fs.writeFileSync('input/a.txt', 'inputA');
      fs.writeFileSync('output/input/a.txt', 'outputA');
      t.equal( fs.readFileSync('output/input/a.txt').toString(), 'outputA' )
      fs.writeFileSync('input/b.txt', 'b');
      fs.writeFileSync('input/other/c.txt', 'inputC');
      fs.writeFileSync('output/input/other/c.txt', 'outputC');
      fs.writeFileSync('input/other/d.txt', 'd');
      copyfiles(['input/**/*.txt', 'output'], {soft:true}, function (err) {
        t.error(err, 'copyfiles');
        fs.readdir('output/input', function (err, files) {
          t.error(err, 'readdir');
          t.deepEquals(files, ['a.txt', 'b.txt', 'other'], 'correct number of things');
          t.equal( fs.readFileSync('output/input/a.txt').toString(), 'outputA' )
          t.equal( fs.readFileSync('output/input/b.txt').toString(), 'b')
          t.equal( fs.readFileSync('output/input/other/c.txt').toString(), 'outputC')
          t.end();
        });
      });
    })
  });
  t.test('teardown', after);
});
test('soft from cl', function (t) {
  t.test('setup', before);
  t.test('copy stuff', function (t) {
    mkdirp('output/input/other', function(){
      fs.writeFileSync('input/a.txt', 'inputA');
      fs.writeFileSync('output/input/a.txt', 'outputA');
      t.equal( fs.readFileSync('output/input/a.txt').toString(), 'outputA' )
      fs.writeFileSync('input/b.txt', 'b');
      fs.writeFileSync('input/other/c.txt', 'inputC');
      fs.writeFileSync('output/input/other/c.txt', 'outputC');
      fs.writeFileSync('input/other/d.txt', 'd');
      cp.spawnSync('./copyfiles', ['-s', 'input/**/*.txt', 'output']);

      fs.readdir('output/input', function (err, files) {
        t.error(err, 'readdir');
        t.deepEquals(files, ['a.txt', 'b.txt', 'other'], 'correct number of things');
        t.equal( fs.readFileSync('output/input/a.txt').toString(), 'outputA' )
        t.equal( fs.readFileSync('output/input/b.txt').toString(), 'b')
        t.equal( fs.readFileSync('output/input/other/c.txt').toString(), 'outputC')
        t.end();
      });
    });
  });
  t.test('teardown', after);
});
test('soft from cl 2', function (t) {
  t.test('setup', before);
  t.test('copy stuff', function (t) {
    mkdirp('output/input/other', function(){
      fs.writeFileSync('input/a.txt', 'inputA');
      fs.writeFileSync('output/input/a.txt', 'outputA');
      t.equal( fs.readFileSync('output/input/a.txt').toString(), 'outputA' )
      fs.writeFileSync('input/b.txt', 'b');
      fs.writeFileSync('input/other/c.txt', 'inputC');
      fs.writeFileSync('output/input/other/c.txt', 'outputC');
      fs.writeFileSync('input/other/d.txt', 'd');
      cp.spawnSync('./copyfiles', ['--soft', 'input/**/*.txt', 'output']);

      fs.readdir('output/input', function (err, files) {
        t.error(err, 'readdir');
        t.deepEquals(files, ['a.txt', 'b.txt', 'other'], 'correct number of things');
        t.equal( fs.readFileSync('output/input/a.txt').toString(), 'outputA' )
        t.equal( fs.readFileSync('output/input/b.txt').toString(), 'b')
        t.equal( fs.readFileSync('output/input/other/c.txt').toString(), 'outputC')
        t.end();
      });
    });
  });
  t.test('teardown', after);
});
test('with up', function (t) {
  t.test('setup', before);
  t.test('copy stuff', function (t) {
    fs.writeFileSync('input/a.txt', 'a');
    fs.writeFileSync('input/b.txt', 'b');
    fs.writeFileSync('input/c.js', 'c');
    copyfiles(['input/*.txt', 'output'], 1, function (err) {
      t.error(err, 'copyfiles');
      fs.readdir('output', function (err, files) {
        t.error(err, 'readdir');
        t.deepEquals(files, ['a.txt', 'b.txt'], 'correct number of things');
        t.end();
      });
    });
  });
  t.test('teardown', after);
});
test('with up cl', function (t) {
  t.test('setup', before);
  t.test('copy stuff', function (t) {
    fs.writeFileSync('input/a.txt', 'a');
    fs.writeFileSync('input/b.txt', 'b');
    fs.writeFileSync('input/c.js', 'c');
    cp.spawnSync('./copyfiles', ['-u', '1', 'input/*.txt', 'output']);
    fs.readdir('output', function (err, files) {
      t.error(err, 'readdir');
      t.deepEquals(files, ['a.txt', 'b.txt'], 'correct number of things');
      t.end();
    });
  });
  t.test('teardown', after);
});
test('with copyup', function (t) {
  t.test('setup', before);
  t.test('copy stuff', function (t) {
    fs.writeFileSync('input/a.txt', 'a');
    fs.writeFileSync('input/b.txt', 'b');
    fs.writeFileSync('input/c.js', 'c');
    cp.spawnSync('./copyup', ['input/*.txt', 'output']);
    fs.readdir('output', function (err, files) {
      t.error(err, 'readdir');
      t.deepEquals(files, ['a.txt', 'b.txt'], 'correct number of things');
      t.end();
    });
  });
  t.test('teardown', after);
});
test('with up 2', function (t) {
  t.test('setup', before);
  t.test('copy stuff', function (t) {
    fs.writeFileSync('input/other/a.txt', 'a');
    fs.writeFileSync('input/other/b.txt', 'b');
    fs.writeFileSync('input/other/c.js', 'c');
    copyfiles(['input/**/*.txt', 'output'], 2, function (err) {
      t.error(err, 'copyfiles');
      fs.readdir('output', function (err, files) {
        t.error(err, 'readdir');
        t.deepEquals(files, ['a.txt', 'b.txt'], 'correct number of things');
        t.end();
      });
    });
  });
  t.test('teardown', after);
});
test('flatten', function (t) {
  t.test('setup', before);
  t.test('copy stuff', function (t) {
    fs.writeFileSync('input/other/a.txt', 'a');
    fs.writeFileSync('input/b.txt', 'b');
    fs.writeFileSync('input/other/c.js', 'c');
    copyfiles(['input/**/*.txt', 'output'], true, function (err) {
      t.error(err, 'copyfiles');
      fs.readdir('output', function (err, files) {
        t.error(err, 'readdir');
        t.deepEquals(files, ['a.txt', 'b.txt'], 'correct number of things');
        t.end();
      });
    });
  });
  t.test('teardown', after);
});
test('follow', function (t) {
  t.test('setup', before);
  t.test('copy stuff', function (t) {
    fs.mkdirSync('input/origin');
    fs.mkdirSync('input/origin/inner');
    fs.writeFileSync('input/origin/inner/a.txt', 'a');
    fs.symlinkSync('origin', 'input/dest');
    copyfiles(['input/**/*.txt', 'output'], { up: 1, follow: true }, function (err) {
      t.error(err, 'copyfiles');
      glob('output/**/*.txt', function (err, files) {
        t.error(err, 'readdir');
        t.deepEquals(files, ['output/dest/inner/a.txt', 'output/origin/inner/a.txt'], 'correct number of things');
        t.end();
      });
    });
  });
  t.test('teardown', after);
});
