/**
 * @fileOverview Test coverage instrumenter.
 */

const {hookRequire} = require('istanbul-lib-hook');
const {createInstrumenter} = require('istanbul-lib-instrument');
const glob = require('glob');
const path = require('path');
const {mkdir} = require('shelljs');
const {readFileSync, writeFileSync} = require('fs');

const instrumenter = createInstrumenter();
const transformer = instrumenter.instrumentSync.bind(instrumenter);
const cov = (global.__coverage__ = {});

const nycOutput = path.resolve(__dirname, '.nyc_output');

function match() {
  const map = {};
  const fn = function (file) {
    return map[file];
  };

  fn.files = glob.sync('app/{**,}/*.js', { __dirname, realpath: true });
  for (let file of fn.files) {
    map[file] = true;
  }

  return fn;
}

function report() {
  mkdir('-p', nycOutput);

  for (let file of matched.files) {
    if (!cov[file]) {
      // Files that are not touched by code ran by the test runner is
      // manually instrumented, to illustrate the missing coverage.
      transformer(readFileSync(file, 'utf-8'), file);
      cov[file] = instrumenter.lastFileCoverage();
    }
  }

  const nycFile = path.join(nycOutput, `${process.type}-${process.pid}.json`);
  writeFileSync(nycFile, JSON.stringify(cov), 'utf-8');
}

const matched = match();
hookRequire(matched, transformer, {});

if (process.type === 'browser') {
  process.on('exit', report);
}
else {
  window.addEventListener('unload', report);
}
