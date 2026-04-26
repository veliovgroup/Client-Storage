/*
 * @Object
 * @name helpers
 */
export const stringifyValue = (value) => {
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
};

export const parseValue = (value) => {
  if (value === 'undefined' || value === undefined) return undefined;
  if (value === 'null') return null;
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

export const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
export const createStore = () => Object.create(null);

export default {
  stringifyValue,
  parseValue,
  hasOwn,
  createStore
};
