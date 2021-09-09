/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const gulp = require('gulp');
const logger = require('gulplog');
const fs = require('fs');
const concat = require('gulp-concat');
const replace = require('gulp-replace');
const del = require('del');
const path = require('path');

function clean() {
  return del('dist/*');
}

function prepareBuild(cb) {
  var dir = 'dist';
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  cb();
}

function copyGlobals() {
  return gulp.src([
    'css/globals/*.css',
    '!css/globals/spectrum-dimensionAliases.css',
    '!css/globals/spectrum-colorAliases.css'
  ])
    .pipe(replace(/:root {/, '.spectrum {'))
    .pipe(gulp.dest('dist/globals/'));
}

function copySources() {
  let classMap = {
    'spectrum-darkest.css': '.spectrum--darkest',
    'spectrum-dark.css': '.spectrum--dark',
    'spectrum-light.css': '.spectrum--light',
    'spectrum-lightest.css': '.spectrum--lightest',
    'spectrum-large.css': '.spectrum--large',
    'spectrum-medium.css': '.spectrum--medium'
  };

  return gulp.src([
      'css/themes/*.css',
      'css/scales/*.css'
    ])
    .pipe(replace(':root', function (match){
      return classMap[path.basename(this.file.path)];
    }))
    .pipe(gulp.dest('dist/'));
}

const insert = require('gulp-insert');

function concatGlobalsFinal() {
  return gulp.src([
    '.tmp/spectrum-global.css',
    'dist/globals/spectrum-dimensionAliases.css',
    'dist/globals/spectrum-colorAliases.css'
  ])
    .pipe(replace(/{/, function(match) {
      if (this.file.path.match('Aliases.css')) {
        return `{\n  /* ${path.basename(this.file.path)} */`;
      }
      return '{';
    }))
    .pipe(concat('spectrum-global.css'))
    .pipe(gulp.dest('dist/'));
}

function concatGlobalsTemp() {
  return gulp.src([
    'css/globals/*.css',
    '!css/globals/index.css',
    '!css/globals/spectrum-dimensionAliases.css',
    '!css/globals/spectrum-colorAliases.css'
  ])
    .pipe(replace(/:root {/, function(match) {
      return `  /* ${path.basename(this.file.path)} */`;
    }))
    .pipe(replace(/}/, ''))
    .pipe(concat('spectrum-global.css'))
    .pipe(insert.prepend('.spectrum {'))
    .pipe(insert.append('}\n'))
    .pipe(gulp.dest('.tmp/'));
}

function processColorAliases() {
  var colorStops = [
    'darkest',
    'dark',
    'light',
    'lightest'
  ];

  return gulp.src([
    'css/globals/spectrum-colorAliases.css'
  ])
    .pipe(replace(/:root/, colorStops.map(stop => `.spectrum--${stop}`).join(',\n')))
    .pipe(gulp.dest('dist/globals/'));
}

function processDimensionAliases() {
  var scales = [
    'medium',
    'large'
  ];

  return gulp.src([
    'css/globals/spectrum-dimensionAliases.css'
  ])
    .pipe(replace(/:root/, scales.map(scale => `.spectrum--${scale}`).join(',\n')))
    .pipe(gulp.dest('dist/globals/'));
}

function copyComponents() {
  return gulp.src([
    '!css/components/index.css',
    'css/components/*.css'
  ])
    .pipe(replace(/:root/, '.spectrum'))
    .pipe(gulp.dest('dist/components/'));
}

function copyMetadata() {
  return gulp.src('json/spectrum-metadata.json')
    .pipe(gulp.dest('dist/'));
}

let build = gulp.series(
  clean,
  prepareBuild,
  gulp.parallel(
    copyMetadata,
    copyGlobals,
    copySources,
    copyComponents,
    concatGlobalsTemp,
    processColorAliases,
    processDimensionAliases
  ),
  concatGlobalsFinal
);

exports.update = gulp.series(
  require('./tasks/updateDNA').updateDNA,
  build
);

exports.clean = clean;
exports.default = build;
exports.build = exports.buildLite = exports.buildHeavy = build;
