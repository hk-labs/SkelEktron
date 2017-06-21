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
