const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const isDev = require('electron-is-dev');

/* istanbul ignore if */
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = isDev ? 'development' : 'production';
}

const {NODE_ENV} = process.env;
const dotenvPath = path.join(path.resolve(__dirname, '..', '..'), '.env');

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
  `${dotenvPath}.${NODE_ENV}.local`,
  `${dotenvPath}.${NODE_ENV}`,
  // Don't include `.env.local` for `test` environment
  // since normally you expect tests to produce the same
  // results for everyone
  NODE_ENV !== 'test' && `${dotenvPath}.local`,
  dotenvPath,
].filter(Boolean);

// Load environment variables from .env* files. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv
for (let i = 0; i < dotenvFiles.length; i++) {
  const dotenvFile = dotenvFiles[i];
  if (fs.existsSync(dotenvFile)) {
    dotenv.config({ path: dotenvFile });
  }
}

/**
 * Get an environment variable value.
 *
 * @param {string} name – environment variable name
 * @param {string} type – can be one of: `int`, `float`, `bool`, `string`
 * @param {*} defaultValue – default value
 */
function getEnvironmentVariable(name, type, defaultValue) {
  if (!(name in process.env)) {
    return defaultValue;
  }

  let value = process.env[name];

  switch (type) {
    case 'string':
      return value; // as it's already a string

    case 'int':
      value = parseInt(value, 10);
      return !isNaN(value) ? value : defaultValue;

    case 'float':
      value = parseFloat(value);
      return !isNaN(value) ? value : defaultValue;

    case 'bool':
      if (typeof value === 'undefined') {
        return defaultValue || false;
      }

      switch (value.toLowerCase()) {
        case 'true':
        case 'yes':
        case '1':
          return true;

        case 'false':
        case 'no':
        case '0':
          return false;

        default:
          console.warn('cannot cast "%s" to boolean (%s)', value, name);
          return value;
      }

    default:
      console.warn('unrecognized environment variable type "%s" (%s)', type, name);
      return value; // as is
  }
}

module.exports = {
  getEnvironmentVariable
};
