/*
 * @Object
 * @name helpers
 */
var helpers = {
  escape: function (value) {
    if (value === undefined) return 'undefined';
    try {
      return JSON.stringify(value);
    } catch (e) {
      try {
        return value.toString();
      } catch (err) {
        return String(value);
      }
    }
  },
  unescape: function (value) {
    if (value === 'undefined' || value === undefined) return undefined;
    if (value === 'null') return null;
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }
};

module.exports = helpers;
