/*
 * @Object
 * @name helpers
 */
var helpers = {
  escape: function (value) {
    try {
      return JSON.stringify(value);
    } catch (e) {
      try {
        return value.toString();
      } catch (err) {
        return value;
      }
    }
  },
  unescape: function (value) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }
};

module.exports = helpers;
